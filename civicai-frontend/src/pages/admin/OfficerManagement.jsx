import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { adminService } from "../../services/api/adminService";
import { complaintService } from "../../services/api/complaintService";

import { useDispatch } from "react-redux";
import {
  setLoading,
  showSnackbar,
} from "../../store/redux/slices/uiSlice";

const officerSchema = yup.object().shape({
  full_name: yup.string().required("Name required"),
  email: yup.string().email().required("Email required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "10 digits")
    .required("Phone required"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .required("Password required"),
  department_id: yup.number().required("Select Department"),
});

const OfficerManagement = () => {
  const dispatch = useDispatch();

  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(officerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      department_id: "",
    },
  });

  const fetchData = async () => {
    dispatch(setLoading(true));

    try {
      const [offs, depts] = await Promise.all([
        adminService.getOfficers(),
        complaintService.getDepartments(),
      ]);

      setOfficers(offs || []);
      setDepartments(depts || []);
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error?.response?.data?.detail || "Failed to load officers",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    reset({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      department_id: "",
    });

    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    dispatch(setLoading(true));

    try {
      await adminService.createOfficer({
        ...data,
        department_id: Number(data.department_id),
      });

      dispatch(
        showSnackbar({
          message: "Officer created successfully",
          severity: "success",
        })
      );

      setDialogOpen(false);
      fetchData();
    } catch (error) {
      dispatch(
        showSnackbar({
          message:
            error?.response?.data?.detail ||
            "Unable to create officer",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminService.updateOfficerStatus(id, !currentStatus);

      dispatch(
        showSnackbar({
          message: "Officer status updated",
          severity: "success",
        })
      );

      fetchData();
    } catch (error) {
      dispatch(
        showSnackbar({
          message:
            error?.response?.data?.detail ||
            "Failed to update status",
          severity: "error",
        })
      );
    }
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Officer Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={openCreate}
        >
          Add Officer
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {officers.map((off) => (
                <TableRow key={off.id} hover>
                  <TableCell>{off.full_name}</TableCell>

                  <TableCell>{off.email}</TableCell>

                  <TableCell>
                    {departments.find(
                      (d) => d.id === off.department_id
                    )?.name || "N/A"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={off.is_active ? "Active" : "Inactive"}
                      color={off.is_active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Switch
                      checked={off.is_active}
                      onChange={() =>
                        handleToggleStatus(off.id, off.is_active)
                      }
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New Officer</DialogTitle>

          <DialogContent>
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone"
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  label="Password"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="department_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Department"
                  margin="normal"
                  error={!!errors.department_id}
                  helperText={errors.department_id?.message}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OfficerManagement;