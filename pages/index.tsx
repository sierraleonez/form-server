import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { Fetcher } from "@/helper/axios";
import { useFormik } from "formik";
import { boolean, number, object, string } from "yup";

type Student = {
  id: number;
  name: string;
  email?: string;
  is_coming?: boolean;
  has_submit: boolean;
  phone_number?: number;
};

type PostFormPayload = {
  participantId: number;
  isComing: boolean;
  email: string;
  phoneNumber: string;
};

export default function Home() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [listStudent, setListStudent] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);

  function postFormData(data: {
    email: any;
    phoneNumber: any;
    available: any;
  }) {
    if (!selectedName) {
      return
    }
    try {
      setLoading(true);
      const payload: PostFormPayload = {
        email: data.email || "",
        phoneNumber: String(data.phoneNumber),
        isComing: Boolean(data.available),
        participantId: Number(selectedName.split("-")[0]),
      };
      Fetcher.post("/form", payload).then((res) => {
        setSelectedName("");
        formik.resetForm();
        setOpenSnack(true);
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
  function getFormData() {
    Fetcher.get("/form-content").then((res) => {
      const list = res.data.map((std: { name: any; id: any }, idx: number) => {
        return std.id + "-" + std.name;
      });
      setListStudent(list);
    });
  }

  useEffect(() => {
    getFormData();
  }, []);

  const validationSchema = object({
    email: string().email("Enter valid email"),
    phoneNumber: number(),
    available: boolean().required("Please fill your availability"),
  });
  const formik = useFormik({
    initialValues: {
      available: 0,
      email: "",
      phoneNumber: "",
    },
    onSubmit: (res) => postFormData(res),
    validationSchema: validationSchema,
  });

  return (
    <div className="bg-white flex-column flex-auto h-screen p-4 space-y-4">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Event Detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            18 April 2023 <br/>
            BigBerry Tegal <br/>
            Urunan: 100k
          </Typography>
        </AccordionDetails>
      </Accordion>
      <h1 className="text-black underline">DivertyOne Bukber Form</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-black">Tell us about you</h3>
          <FormControl fullWidth>
            <Autocomplete
              color="secondary"
              disablePortal
              id="participant"
              options={listStudent}
              value={selectedName}
              onChange={(_, val) => setSelectedName(val || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  sx={{ color: "GrayText" }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Available?</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              onChange={formik.handleChange}
              error={
                formik.touched.available && Boolean(formik.errors.available)
              }
              id="available"
              name="available"
              label="Available?"
              value={formik.values.available}
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        <h3 className="text-black">Tell us how to reach you</h3>
        <div>
          <FormControl fullWidth className="space-y-4">
            <TextField
              label="Email"
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
          </FormControl>
        </div>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          className="text-black"
        >
          Submit
        </Button>

        <Dialog open={openSnack} onClose={() => setOpenSnack(false)}>
          <DialogTitle>Data submitted</DialogTitle>
          <DialogContent>
            <p>Thank you, Your registration is now complete.</p>
            <p>Please follow the payment instruction and event guideline</p>
            <p>See you there!</p>
          </DialogContent>
        </Dialog>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme: any) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </form>
    </div>
  );
}
