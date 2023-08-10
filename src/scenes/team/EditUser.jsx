import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, useTheme, MenuItem } from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const EditUser = () => {
  const { id } = useParams(); // <-- get the user ID from the URL
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "employee",
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // <-- get navigate function

  // Call the API to get the user details when the component is first loaded
  useEffect(() => {
    axios.get(`http://localhost:3000/api/users/${id}`)
      .then(response => {
        const user = response.data;
        setInitialValues({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
        });
      })
      .catch(error => {
        console.error(`There was an error retrieving the user: ${error}`);
      });
  }, [id]); // <-- run this useEffect when the `id` changes

  const handleFormSubmit = (values, { setSubmitting }) => { 
    axios.put(`http://localhost:3000/api/users/${id}`, values) // <-- call the PUT API
      .then(response => {
        console.log(response.data);
        setSubmitting(false); // stop showing the submitting state in form
        navigate("/users"); // navigate to /user
      })
      .catch(error => {
        console.error(`There was an error updating the user: ${error}`);
        setSubmitting(false); // stop showing the submitting state in form
      });
  };

  return (
    <Box m="20px">
      <Header title="EDIT User" subtitle="Update Existing User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 2" }}
              >
               
                  <MenuItem key={1} value="admin">ADMIN</MenuItem>
                  <MenuItem key={2} value="manager">MANAGER</MenuItem>
                  <MenuItem key={3} value="finance">FINANCE MANAGER</MenuItem>
                  <MenuItem key={4} value="employee">EMPLOYEE</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button
              LinkComponent={Link}
              to="/users"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                padding: "10px 20px",
                margin: "5px",
              }}
            >
              Back to user list
            </Button>
            <Button type="submit" color="secondary" variant="contained" sx={{
              fontSize: "14px",
              padding: "10px 20px",
              margin: "5px",
            }}
            disabled={isSubmitting}>
              Update User 
            </Button>
          </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
  role: yup.string().required("required"),
});

export default EditUser;