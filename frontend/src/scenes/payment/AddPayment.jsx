  import axios from 'axios';
  import { useEffect, useState } from 'react';
  import { Box, Button, TextField, useTheme,MenuItem, FormControl,Select} from "@mui/material";
  import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

  import { Formik } from "formik";
  import { tokens } from "../../theme";
  import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import Header from "../../components/Header";

  const AddPayment = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate(); 
    const [selectedOption, setSelectedOption] = useState('cashin');
    const [selectedValue, setSelectedValue] = useState('');
    const [projects, setProjects] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vendors,setVendors]=useState([]);

    useEffect(() => {
      // Fetch projects
      const getProjects = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/projects");
          setProjects(response.data);
        } catch (error) {
          console.error(`Error getting projects: ${error}`);
        }
      };
      getProjects();
    
    }, []);


    useEffect(() => {
      // Fetch customers and vendors
      const fetchData = async () => {
        try {
          const customersResponse = await axios.get("http://localhost:5000/api/customers");
          const vendorsResponse = await axios.get("http://localhost:5000/api/vendors");
          setCustomers(customersResponse.data);
          setVendors(vendorsResponse.data);
        } catch (error) {
          console.error(`Error getting data: ${error}`);
        }
      };
      fetchData();
    }, []);

 //radio button
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedValue(''); // Reset the selected value when radio button changes
  };


 

  

    const handleFormSubmit = (values, { setSubmitting }) => { 
      console.log("Form values:", values); // Debugging line
      axios.post('http://localhost:5000/api/payments', { ...values, cashin: selectedOption === "cashin" ? 1 : 0 })
        .then(response => {
          console.log(response.data);
          setSubmitting(false);
          navigate("/payment");
        })
        .catch(error => {
          console.error(`There was an error creating the payment: ${error}`);
          setSubmitting(false);
        });
    };
    

    return (
      <Box m="20px">
        <Header title="CREATE payment" subtitle="Create a New payment Profile" />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            ...initialValues,
            role: '',
            project: projects.length > 0 ? projects[0]._id : null, // Set default project
          }}
         

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


  {/* Radio Group for Customer/Vendor */}
<RadioGroup row value={selectedOption} onChange={handleOptionChange}   sx={{

        display: 'flex  ',
        gridColumn:"span 2",
        gridTemplateColumns: 'repeat(2, 1fr)', // Display two columns
        gridColumnGap: '16px', // Adjust the gap between columns


        
      }}>
        <FormControlLabel value="cashin" control={<Radio />} label="Cash In"  />
        <FormControlLabel value="cashout" control={<Radio />} label="Cash Out" />
      </RadioGroup>
     

<Box > 
      {selectedOption === 'cashin' && (
        <FormControl>
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
                 sx={{
          gridColumn: 'span 4',
          width: '185%',    // Set width to 100%
          minWidth: '200px' // Set a minimum width for better visibility
        }}             
         >
                {customers.map(customer => (
                  <MenuItem key={customer._id} value={customer._id}>{customer.firstName} {customer.lastName}</MenuItem>
                ))}
              </TextField>
        </FormControl>
      )}


{selectedOption === 'cashout' && (
        <FormControl>
            <TextField
                select
                fullWidth
                variant="filled"
                label="Vendor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.vendor}
                name="vendor"
                error={!!touched.vendor && !!errors.vendor}
                helperText={touched.vendor && errors.vendor}
                 sx={{
          gridColumn: 'span 2',
          width: '185%',    // Set width to 100%
          minWidth: '200px' // Set a minimum width for better visibility
        }}
                >
                {vendors.map(vendor => 
                  <MenuItem key={vendor._id} value={vendor._id}>{vendor.firstName} {vendor.lastName}</MenuItem>
                )}
              </TextField>
        </FormControl>
      )}

</Box>


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
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date}
                  name="date"
                  error={!!touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 4" }}
                />



                    {projects.length > 0 && (
                    <TextField
                      select
                      fullWidth
                      variant="filled"
                      label="project"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.project}
                      name="project"
                      error={!!touched.project && !!errors.project}
                      helperText={touched.project && errors.project}
                      sx={{ gridColumn: "span 2" }}
                    >
                      {projects.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.projectName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
              <Button
                LinkComponent={Link}
                to="/payment"
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  padding: "10px 20px",
                  margin: "5px",
                }}
              >
                Back to payment list
              </Button>
              <Button type="submit" color="secondary" variant="contained" sx={{
                fontSize: "14px",
                padding: "10px 20px",
                margin: "5px",
              }}
              disabled={isSubmitting}>
                Create New payment
              </Button>
            </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };



  const checkoutSchema = yup.object().shape({
    date: yup.date().required("required"),
    customer: yup.string(), 
    vendor: yup.string(), 
    amount: yup.number().required("required"),
    description: yup.string().required("required"),
    project:yup.string().required("required"),

  });

    const initialValues = {
      date: "",
      customer: "", // Include the fromto field
      vendor: "", // Include the fromto field
      amount: "",
      description: "",
      project: "", // Use the first project's _id as default
    };
  

  export default AddPayment;
