import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import { getCategory } from "../utils/categories";
import EntryModal from "./EntryModal";
import {stages} from "./ProgressTracker"

// Table component that displays entries on home screen

export default function BasicTable({ entries }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >User</TableCell>
            <TableCell >Category</TableCell>
            <TableCell >Progress</TableCell>
            <TableCell align="right">Open</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {entry.name}
              </TableCell>
              <TableCell >
                <a href={`mailto:${entry.email}`}>{entry.email}</a>
              </TableCell>
              <TableCell >{entry.user}</TableCell>
              <TableCell >
                {getCategory(entry.category).name}
              </TableCell>
               <TableCell >
               <LinearProgress  variant="determinate"  value={((entry?.stage || 0)/(stages.length - 1)) * 100}/>
              </TableCell>
              <TableCell
                sx={{ "padding-top": 0, "padding-bottom": 0 }}
                align="right"
              >
                <EntryModal entry={entry} type="edit" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
