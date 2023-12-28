import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useState, useEffect } from "react";
import { getCategory } from "../utils/categories";
import Divider from "@mui/material/Divider";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import Filter4Icon from "@mui/icons-material/Filter4";
import Filter5Icon from "@mui/icons-material/Filter5";
import Filter6Icon from "@mui/icons-material/Filter6";
import { useTheme } from "@mui/material";
import { updateEntry } from "../utils/mutations";

export const stages = [{
    label: "First Contact",
    icon: <Filter1Icon />,
    description: `At this stage, the potential speaker has been identified but not reached out to. An HPAIR member should reach out to the potential speaker via cold email.`,
  },
  {
    label: "Awaiting Reponse",
    icon: <Filter2Icon />,
    description: `At this stage, an HPAIR member should have reached out to the potential speaker via cold email. Members should wait on their reply, sending a follow up email after two weeks of no response.`,
  },
  {
    label: "Positive/Negative Engagement",
    icon: <Filter3Icon />,
    description: `The potential speaker has responded postively or negatively. If they are not interested, follow up with a thank you, and remove the lead. If they responded postively, continue to the next step.`,
  },
  {
    label: "Propose Times",
    icon: <Filter4Icon />,
    description: `At this stage an HPAIR member (ideally the same person) should reach out again and provide more detailed information about the conference as well as potential times to speak. Members should offer to meet online or in-person if possible.`,
  },
   {
    label: "Awaiting Confirmation",
    icon: <Filter5Icon />,
    description: `At this stage the potential speaker has been given time options and HPAIR is awaiting response. Members should wait on their reply, sending a follow up email after two weeks of no response.`,
  },
  {
    label: "Confirmed Speaker",
    icon: <Filter6Icon />,
    description: `At this stage, the speaker is confirmed and scheduled for the conference! The same HPAIR member should remind the speaker 2 weeks prior to the confrence.`,
  },
];

export default function ProgressTracker({ entries }) {
  const theme = useTheme();
  const [contact, setContact] = useState("");

  useEffect(() => {
    if(contact) setContact(entries.find((entry) => entry.id === contact.id));
  }, [entries, contact]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Contact</InputLabel>
          <Select
            label="Contact"
            value={contact?.id}
            onChange={(event) =>
              setContact(entries.find((x) => x.id === event.target.value))
            }
          >
            {entries.map((entry) => (
              <MenuItem key={entry.id} value={entry.id}>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                >
                  {entry.name}
                  <Typography color="gray">
                    {getCategory(entry.category).name}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider />

      <Stack alignItems="center" justifyContent="center">
        {contact ? (
          <Stack alignItems="center" spacing={2}>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyItems="center"
              divider={
                <Divider
                  sx={{
                    width: 128,
                    borderBottomWidth: 2,
                  }}
                />
              }
            >
              {stages.map((step, i) => (
                <Stack
                  spacing={1}
                  alignItems="center"
                  key={i}
                  color={
                    i === (contact?.stage || 0)
                      ? theme.palette.primary.main
                      : "grey"
                  }
                >
                  {step.icon}
                  <Typography textAlign="center">{step.label}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider orientation="horizontal" />

            <Typography fontSize={18}>
              {stages[contact?.stage || 0].description}
            </Typography>

            <Stack direction="row" spacing={2}>
              {(contact?.stage || 0) !== 0 && (
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() =>
                    updateEntry({
                      ...contact,
                      stage: (contact?.stage || 0) - 1,
                    })
                  }
                >
                  Too far, go to previous step
                </Button>
              )}
              {(contact?.stage || 0) !== stages.length - 1 && (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    updateEntry({
                      ...contact,
                      stage: (contact?.stage || 0) + 1,
                    })
                  }
                >
                  Completed, continue to next step
                </Button>
              )}
            </Stack>
          </Stack>
        ) : (
          <Typography>Select a Contact to View Progress!</Typography>
        )}
      </Stack>
    </Stack>
  );
}
