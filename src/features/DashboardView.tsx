import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RepoCardView from "../components/repoCardView";
import axios from "axios";
import { useDebounce } from "../utils/util";
import { IRepoList } from "../utils/types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import dayjs from "dayjs";

const DashboardView = () => {
  const [repoList, setRepoList] = useState<Array<IRepoList>>([]);
  const [filteredList, setFilteredList] = useState<Array<IRepoList>>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedValue = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = React.useState("none");

  const _handleSearch = (query: string) => {
    setSortBy("none");
    setSearchQuery(query);
    if (query === "") {
      setRepoList([]);
      setFilteredList([]);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    if (event.target.value === "none") {
      return setFilteredList(repoList);
    }
    const sortedList = filteredList.sort((a, b) => {
      if (["created_at", "updated_at"].includes(event.target.value)) {
        const compare: any = dayjs(a[event.target.value]).isBefore(
          dayjs(b[event.target.value]),
          "second"
        );
        return compare ? 1 : -1;
      }
      if (
        ["stargazers_count", "watchers_count", "score"].includes(
          event.target.value
        )
      ) {
        return a[event.target.value] - b[event.target.value];
      }
      if (event.target.value === "name") {
        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }
      return 0;
    });
    setFilteredList(sortedList);
  };

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`https://api.github.com/search/repositories?q=${searchQuery}`)
        .then((data) => {
          setRepoList([...data.data.items]);
          setFilteredList([...data.data.items]);
        });
    }
  }, [debouncedValue]);

  const _renderRepoGrid = () => {
    if (repoList.length === 0) {
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <h3>Search Repos</h3>
          </Grid>
        </Grid>
      );
    }
    return filteredList.map((repoItem) => (
      <Grid key={repoItem.id} item sm={3}>
        <RepoCardView repoData={repoItem} />
      </Grid>
    ));
  };

  return (
    <Box sx={{ margin: 1 }}>
      <Grid container direction="column" spacing={3}>
        <Grid
          container
          item
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
        >
          <Grid item sm={10}>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Seach..."
              variant="outlined"
              value={searchQuery}
              onChange={(e: any) => _handleSearch(e.target.value)}
            />
          </Grid>
          <Grid item sm={2}>
            <Select
              sx={{ width: "100%" }}
              value={sortBy}
              onChange={handleChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="stargazers_count">Stars</MenuItem>
              <MenuItem value="watchers_count">Watchers Count</MenuItem>
              <MenuItem value="score">Score</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="created_at">Created At</MenuItem>
              <MenuItem value="updated_at">Updated At</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid item container direction="row" spacing={3}>
          {_renderRepoGrid()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;
