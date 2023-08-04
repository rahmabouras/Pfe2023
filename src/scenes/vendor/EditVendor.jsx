import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const EditVendor = () => {
  const { id } = useParams(); // <-- get the vendor ID from the URL
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // <-- get navigate function

  // Call the API to get the vendor details when the component is first loaded
  useEffect(() => {
    axios.get(`http://localhost:3000/api/vendors/${id}`)
      .then(response => {
        const vendor = response.data;
        setInitialValues({
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
          phoneNumber: vendor.phoneNumber,
          address: vendor.address,
        });
      })
      .catch(error => {
        console.error(`There was an error retrieving the vendor: ${error}`);
      });
  }, [id]); // <-- run this useEffect when the `id` changes

  const handleFormSubmit = (values, { setSubmitting }) => { 
    axios.put(`http://localhost:3000/api/vendors/${id}`, values) // <-- call the PUT API
      .then(response => {
        console.log(response.data);
        setSubmitting(false); // stop showing the submitting state in form
        navigate("/vendor"); // navigate to /vendor
      })
      .catch(error => {
        console.error(`There was an error updating the vendor: ${error}`);
        setSubmitting(false); // stop showing the submitting state in form
      });
  };

  return (
    <Box m="20px">
      <Header title="EDIT VENDOR" subtitle="Update Existing Vendor Profile" />

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
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button
              LinkComponent={Link}
              to="/vendor"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                padding: "10px 20px",
                margin: "5px",
              }}
            >
              Back to vendor list
            </Button>
            <Button type="submit" color="secondary" variant="contained" sx={{
              fontSize: "14px",
              padding: "10px 20px",
              margin: "5px",
            }}
            disabled={isSubmitting}>
              Update Vendor 
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
});

export default EditVendor;
