import axios from 'axios';
import { Box, Button, TextField, useTheme, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import Avatar1 from "react-avatar-edit";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom"; 
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // don't forget to import the CSS


const AddUser = () => {

  const [img, setImg] = useState("");
  const [sotreImage, setSotreImage] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onCrop = (view) => {
    setImg(view);
  };

  const onClose = (view) => {
    setImg(null);
  };

  const saveImage = () => {
    setSotreImage([{ img }]);
    // props.onSetProfileImage(img);
    setOpen(false);
  };



  // getting windows width
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);










  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); 

  const handleFormSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
  
    Object.keys(values).forEach((key) => {
      if (key !== 'avatarPreviewUrl') {
        formData.append(key, values[key]);
      }
    });

    axios.post('http://localhost:5000/api/users', formData)
      .then(response => {
        console.log(response.data);
        setSubmitting(false); 
        navigate("/users"); 
      })
      .catch(error => {
        console.error(`There was an error creating the user: ${error}`);
        setSubmitting(false); 
      });
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

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
          setFieldValue,
        }) => {
          const handleFileChange = (event) => {
            const file = event.currentTarget.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setFieldValue("avatarPreviewUrl", reader.result);
              setFieldValue("avatarUrl", "");
            };
            if (file) {
              reader.readAsDataURL(file);
            }
          };
          

          return (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
            <label htmlFor="profilePhoto">

            {/* <Avatar
              src={values.avatarPreviewUrl}
              sx={{ width: 75, height: 75, cursor: 'pointer' }}
            /> */}


      <Avatar
        sx={{ width: 120, height: 120, marginBottom: 1 }}
        alt="profile img"
        src={
          img.length ? img : `https://img.icons8.com/color/344/test-account.png`
        }
      />

        <Button
          className="change-profile-photo-btn"
          variant="outlined"
          onClick={handleClickOpen}>
          Change Profile Photo
        </Button>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Update Image
          </DialogTitle>
          <DialogContent>
            <Avatar1
              width={windowSize.innerWidth > 900 ? 400 : 'auto'}
              height={windowSize.innerWidth > 500 ? 400 : 150}
              onCrop={onCrop}
              onClose={onClose}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" onClick={saveImage}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
            </label>
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
              Create New User
            </Button>
          </Box>
          </form>
        )}}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  avatarUrl: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
  role: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
  email: "",
  phoneNumber: "",
  address: "",
  role: "employee",
};

export default AddUser;
