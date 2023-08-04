import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, useTheme,MenuItem } from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const EditPayment = () => {
  const { id } = useParams(); // <-- get the customer ID from the URL
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

  const [projects, setProjects] = useState([]);


 
  useEffect(() => {
    // Fetch projects
    const getProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error(`Error getting projects: ${error}`);
      }
    };
    getProjects();
   
  }, []);
  


  // Call the API to get the customer details when the component is first loaded
  useEffect(() => {
    axios.get(`http://localhost:3000/api/payments/${id}`)
      .then(response => {
        const customer = response.data;
        setInitialValues({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
        });
      })
      .catch(error => {
        console.error(`There was an error retrieving the customer: ${error}`);
      });
  }, [id]); // <-- run this useEffect when the `id` changes

  const handleFormSubmit = (values, { setSubmitting }) => { 
    axios.put(`http://localhost:3000/api/payments/${id}`, values) // <-- call the PUT API
      .then(response => {
        console.log(response.data);
        setSubmitting(false); // stop showing the submitting state in form
        navigate("/payments"); // navigate to /customer
      })
      .catch(error => {
        console.error(`There was an error updating the payment: ${error}`);
        setSubmitting(false); // stop showing the submitting state in form
      });
  };

  return (
    <Box m="20px">
      <Header title="EDIT payment" subtitle="Update Existing payment" />

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
                label="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                name="date"
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="fromto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fromto}
                name="fromto"
                error={!!touched.fromto && !!errors.fromto}
                helperText={touched.fromto && errors.fromto}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                sx={{ gridColumn: "span 4" }}
              />


            

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="phoneNumber"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
             <TextField
                select
                fullWidth
                variant="filled"
                label="Project"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.project}
                name="manager"
                error={!!touched.project && !!errors.project}
                helperText={touched.project && errors.project}
                sx={{ gridColumn: "span 2" }}
              >
                 {projects
                  .map((project) => (
                    <MenuItem key={project.projectName} value={project.projectName}>
                      {project.projectName}
                    </MenuItem>
                  ))}
              </TextField>
             
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button
              LinkComponent={Link}
              to="/payments"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                padding: "10px 20px",
                margin: "5px",
              }}
            >
              Back to customer list
            </Button>
            <Button type="submit" color="secondary" variant="contained" sx={{
              fontSize: "14px",
              padding: "10px 20px",
              margin: "5px",
            }}
            disabled={isSubmitting}>
              Update payment
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

export default EditPayment;
