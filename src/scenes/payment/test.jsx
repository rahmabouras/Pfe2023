import React, { useEffect, useState } from "react";
import { Box, Button, TextField, useTheme, MenuItem } from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const AddProject = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();






  useEffect(() => {
    // Fetch customers
    const getCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error(Error getting customers: ${error});
      }
    };
    // Fetch all users
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error(Error getting users: ${error});
      }
    };
  
    getCustomers();
    getUsers();
  }, []);
  



  const handleFormSubmit = (values, { setSubmitting }) => {
    axios.post('http://localhost:5000/api/projects', values)
      .then(response => {
        console.log(response);
        setSubmitting(false);
        navigate("/projects");
      })
      .catch(error => {
        console.error(There was an error creating the project: ${error});
        setSubmitting(false);
      });
  };

  return (
    <Box m="20px">
      <Header title="CREATE PROJECT" subtitle="Create a New Project" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
                label="Project Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.projectName}
                name="projectName"
                error={!!touched.projectName && !!errors.projectName}
                helperText={touched.projectName && errors.projectName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Customer"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customer}
                name="customer"
                error={!!touched.customer && !!errors.customer}
                helperText={touched.customer && errors.customer}
                sx={{ gridColumn: "span 2" }}
              >
                {customers.map(customer => 
                  <MenuItem key={customer._id} value={customer._id}>{customer.firstName} {customer.lastName}</MenuItem>
                )}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Due Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dueDate}
                name="dueDate"
                error={!!touched.dueDate && !!errors.dueDate}
                helperText={touched.dueDate && errors.dueDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Project Manager"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.manager}
                name="manager"
                error={!!touched.manager && !!errors.manager}
                helperText={touched.manager && errors.manager}
                sx={{ gridColumn: "span 2" }}
              >
                {users
                  .filter((user) => user.role === "manager")
                  .map((manager) => (
                    <MenuItem key={manager._id} value={manager._id}>
                      {manager.firstName} {manager.lastName}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Project Value"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.value}
                name="value"
                error={!!touched.value && !!errors.value}
                helperText={touched.value && errors.value}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Overall Progress"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.progress}
                name="progress"
                error={!!touched.progress && !!errors.progress}
                helperText={touched.progress && errors.progress}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Status"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.status}
                name="status"
                error={!!touched.status && !!errors.status}
                helperText={touched.status && errors.status}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value={"Planned"}>Planned</MenuItem>
                <MenuItem value={"Progress"}>Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
                <MenuItem value={"Done"}>Done</MenuItem>
                <MenuItem value={"On Hold"}>On Hold</MenuItem>
                <MenuItem value={"Canceled"}>Canceled</MenuItem>
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Project BIC Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bic}
                name="bic"
                error={!!touched.bic && !!errors.bic}
                helperText={touched.bic && errors.bic}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                LinkComponent={Link}
                to="/projects"
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  padding: "10px 20px",
                  margin: "5px",
                }}
              >
                Back to project list
              </Button>
              <Button type="submit" color="secondary" variant="contained" sx={{
              fontSize: "14px",
              padding: "10px 20px",
              margin: "5px",
            }}
            disabled={isSubmitting}>
              Create New Project
            </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  projectName: yup.string().required("required"),
  customer: yup.string().required("required"),
  manager: yup.string().required("required"),
  startDate: yup.date().required("required"),
  dueDate: yup.date().required("required").min(yup.ref('startDate'), "Due date can't be before start date"),
  progress: yup.number().required("required").min(0).max(100),  // revised from 'overallProgress'
  value: yup.number().required("required").min(0),              // revised from 'projectValue'
  status: yup.string().required("required"),
  bic: yup.string().required("required"),  // added this field since it's used in the form
});


const initialValues = {
    projectName: "",
    customer: "",
    manager: "",
    startDate: "",
    dueDate: "",
    progress: "",  // revised from 'overallProgress'
    value: "",     // revised from 'projectValue'
    status: "",
    bic: "",       // added this field since it's used in the form
  };


export default AddProject;