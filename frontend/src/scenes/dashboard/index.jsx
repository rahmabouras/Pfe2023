import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  
  // Create the header row
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';
      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
}


const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        const newProjects = response.data.map(project => ({
          ...project,
          startDate: project.startDate.slice(0, 10),
        }));
  
        // Sort projects by startDate in descending order (newest to oldest)
        const sortedProjects = newProjects.sort((a, b) => {
          return new Date(b.startDate) - new Date(a.startDate);
        });
  
        console.log(sortedProjects);
        setProjects(sortedProjects);
      })
      .catch(error => console.error(`There was an error retrieving the projects: ${error}`));
  }, []);
  

  const getProjectCounts = (status) => {
    return projects.filter((project) => project.status === status).length;
  };

  const totalCount = projects.length;

  const getProjectPercentage = (status) => {
    const count = getProjectCounts(status);
    return totalCount ? (count / totalCount * 100).toFixed(2) : 0;
  };

  const incrementYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  const decrementYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const downloadReports = () => {
    // Convert project data to CSV format
    const csvData = convertToCSV(projects);
    // Trigger download
    downloadCSV(csvData, 'projects_report.csv');
  }
  
  
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            onClick={downloadReports}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={getProjectCounts("Planned")}
            subtitle="Planned"
            progress={getProjectPercentage("Planned")/100}
            increase={getProjectPercentage("Planned") + "%"}
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={getProjectCounts("Progress")}
            subtitle="Progress"
            progress={getProjectPercentage("Progress")/100}
            increase={getProjectPercentage("Progress") + "%"}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={getProjectCounts("Done")}
            subtitle="Done"
            progress={getProjectPercentage("Done")/100}
            increase={getProjectPercentage("Done") + "%"}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={getProjectCounts("Closed")}
            subtitle="Closed"
            progress={getProjectPercentage("Closed")/100}
            increase={getProjectPercentage("Closed") + "%"}
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
                sx={{ margin: "0 15px" }}
              >
                Earning for  
              </Typography>
              <IconButton 
                onClick={decrementYear} 
                sx={{ 
                  color: colors.grey[100], 
                  padding: "0",
                  '&:hover': {
                    backgroundColor: colors.greenAccent[400],
                    color: colors.grey[100],
                  }
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
                sx={{ margin: "0" }}
              >
                {selectedYear}
              </Typography>
              <IconButton 
                onClick={incrementYear} 
                sx={{ 
                  color: colors.grey[100], 
                  padding: "0",
                  '&:hover': {
                    backgroundColor: colors.greenAccent[400],
                    color: colors.grey[100],
                  }
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="375px" m="-20px 0 0 0">
            <LineChart selectedYear = {selectedYear} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Projects
            </Typography>
          </Box>
          {projects.map((project, i) => (
            <Box
              key={`project-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  ref_{project._id}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {project.projectName}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{project.startDate}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${project.projectValue}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
