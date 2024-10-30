import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function CreateInterview() {
  const [formstate, setForm] = useState({
    technology: undefined,
    experience: undefined,
    important_topics: undefined,
  });
  const [allInterviews, setAllIterviews] = useState([]);
  const onTechnologyChange = (event) => {
    setForm((e) => ({
      technology: event.target.value,
      experience: e.experience,
      important_topics: e.important_topics,
    }));
  };
  const onExperinceChange = (event) => {
    setForm((e) => ({
      technology: e.technology,
      experience: event.target.value,
      important_topics: e.important_topics,
    }));
  };
  const onimportantTopChange = (event) => {
    setForm((e) => ({
      technology: e.technology,
      experience: e.experience,
      important_topics: event.target.value,
    }));
  };

  const getAllInterviews = () => {
    axios
      .get("http://localhost:8000/interview/")
      .then((res) => {
        console.log(res);
        if (res?.status == 200) {
          setAllIterviews(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addInterview = (data) => {
    axios.post("http://localhost:8000/interview/", data).then((res) => {
      if (res.status == 200) {
        alert("Interview added");
        getAllInterviews();
      }
    });
  };
  const toISOString = (d) => {
    return (
      [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
        "-"
      ) +
      "T" +
      [
        padLeft(d.getHours()),
        padLeft(d.getMinutes()),
        padLeft(d.getSeconds()),
      ].join(":")
    );
  };
  const padLeft = (num) => {
    var len = String(num).length;
    return len == 1 ? "0" + num : num;
  };

  const submitData = (e) => {
    e.preventDefault();
    if (
      !formstate.technology ||
      !formstate.experience ||
      !formstate.important_topics
    ) {
      alert("wrong input");
      return;
    }
    const today = new Date().toISOString();
    console.log(today);
    const data = {
      experience: formstate.experience,
      //dummy value
      endTime: today,
      id: 1,
      interview_status: false,
      //dummy value
      startTime: today,
      technology: formstate.technology,
      important_points: formstate.important_topics,
    };
    addInterview(data);
    console.log("submitted");
  };

  useEffect(() => {
    getAllInterviews();
  }, []);
  return (
    <Grid>
      <Grid>
        <Typography variant="h6">Create Interview</Typography>
        <form onSubmit={submitData}>
          <FormControl>
            <InputLabel htmlFor="technology">Technology</InputLabel>
            <Input
              id="technology"
              onChange={onTechnologyChange}
              value={formstate.technology}
              aria-describedby="my-helper-text"
            />
            {/* <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText> */}
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="experience">Experience</InputLabel>
            <Input
              type="number"
              id="experience"
              value={formstate.experience}
              aria-describedby="my-helper-text"
              onChange={onExperinceChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="important-topics">Important-Topics</InputLabel>

            <Input
              id="important-topics"
              value={formstate.important_topics}
              aria-describedby="important-topics-helper"
              onChange={onimportantTopChange}
            />
            <FormHelperText id="important-topics-helper">
              Please enter comma saperated values.
            </FormHelperText>
          </FormControl>
          <Grid>
            <Button type="submit" variant="contained">
              Create Interview
            </Button>
          </Grid>
        </form>
      </Grid>
      <Grid>
        <Table sx={{ borderWidth: "5px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Technology</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          {allInterviews.map((e) => (
            <TableRow>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.technology}</TableCell>
              <TableCell>{e.experience}</TableCell>
              <TableCell>
                <Button>Start</Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
    </Grid>
  );
}

export default CreateInterview;
