import * as React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useIsAuthenticated, useSignIn, useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, useTheme } from '@mui/material';
import { tokens } from "../../theme";

const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    if (isAuthenticated) {
      signOut();
    }
  }, []);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
  
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      // Send a POST request to your API endpoint for authentication
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Check if login was successful
      if (response.data && response.data.token) {
        // Save token using react-auth-kit or another method
        if(signIn({token: response.data.token, expiresIn: 3600, tokenType: "Bearer", authState: {user : response.data.user}})) {
          console.log('Successfully signed in');
          navigate(`/chat`);
        } else {
          console.log('Failed to sign in');
        }
      }
    } catch (error) {
      console.error('An error occurred while signing in', error);
      // Handle error appropriately
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: colors.primary[400],
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: colors.grey[100] }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          backgroundColor: colors.grey[200],
        }}
      />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={{
              backgroundColor: colors.grey[200],
            }}
          />
        <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} value="remember" color="primary" />}
                label="Remember me"
                sx={{ color: colors.grey[100] }}
              />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: colors.blueAccent[700], color: colors.grey[100] }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;