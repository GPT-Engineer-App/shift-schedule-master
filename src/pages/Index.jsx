import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Container, VStack, Text, Input, Button, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Mock data for employees
const employees = Array.from({ length: 100 }, (_, i) => ({ id: `emp${i + 1}`, name: `Employee ${i + 1}` }));

// Login Page
const LoginPage = ({ onLogin }) => {
  const toast = useToast();
  const initialValues = { employeeId: "" };
  const validationSchema = Yup.object({
    employeeId: Yup.string()
      .required("Employee ID is required")
      .oneOf(
        employees.map((emp) => emp.id),
        "Invalid Employee ID",
      ),
  });

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Text fontSize="2xl">Employee Login</Text>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values) => onLogin(values.employeeId)}>
          {({ errors, touched }) => (
            <Form>
              <Field name="employeeId">
                {({ field }) => (
                  <FormControl isInvalid={errors.employeeId && touched.employeeId}>
                    <FormLabel htmlFor="employeeId">Employee ID</FormLabel>
                    <Input {...field} id="employeeId" placeholder="Enter your Employee ID" />
                    <FormErrorMessage>{errors.employeeId}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button mt={4} colorScheme="teal" type="submit">
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </VStack>
    </Container>
  );
};

// Shift Input Page
const ShiftInputPage = ({ employeeId, onSubmitShifts }) => {
  const initialValues = { shifts: Array(30).fill("") };
  const validationSchema = Yup.object({
    shifts: Yup.array().of(Yup.string().required("Shift is required")),
  });

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Text fontSize="2xl">Input Shifts for {employeeId}</Text>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values) => onSubmitShifts(employeeId, values.shifts)}>
          {({ errors, touched }) => (
            <Form>
              {Array.from({ length: 30 }, (_, i) => (
                <Field key={i} name={`shifts[${i}]`}>
                  {({ field }) => (
                    <FormControl isInvalid={errors.shifts && touched.shifts && errors.shifts[i] && touched.shifts[i]}>
                      <FormLabel htmlFor={`shifts[${i}]`}>Day {i + 1}</FormLabel>
                      <Input {...field} id={`shifts[${i}]`} placeholder="Enter shift" />
                      <FormErrorMessage>{errors.shifts && errors.shifts[i]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              ))}
              <Button mt={4} colorScheme="teal" type="submit">
                Submit Shifts
              </Button>
            </Form>
          )}
        </Formik>
      </VStack>
    </Container>
  );
};

// Admin Page
const AdminPage = ({ shifts }) => {
  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Text fontSize="2xl">Admin View</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Employee ID</Th>
              {Array.from({ length: 30 }, (_, i) => (
                <Th key={i}>Day {i + 1}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(shifts).map(([employeeId, employeeShifts]) => (
              <Tr key={employeeId}>
                <Td>{employeeId}</Td>
                {employeeShifts.map((shift, i) => (
                  <Td key={i}>{shift}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

// Main Component
const Index = () => {
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [shifts, setShifts] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (employeeId) => {
    if (employeeId === "admin") {
      setIsAdmin(true);
    } else {
      setLoggedInEmployee(employeeId);
    }
  };

  const handleSubmitShifts = (employeeId, employeeShifts) => {
    setShifts((prevShifts) => ({ ...prevShifts, [employeeId]: employeeShifts }));
    setLoggedInEmployee(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/shifts" element={loggedInEmployee ? <ShiftInputPage employeeId={loggedInEmployee} onSubmitShifts={handleSubmitShifts} /> : <Navigate to="/" />} />
        <Route path="/admin" element={isAdmin ? <AdminPage shifts={shifts} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default Index;
