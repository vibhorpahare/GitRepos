import React, { useEffect, useState } from "react";
import { Avatar, CardHeader, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import { IRepoList } from "../utils/types";

const RepoCardView = (props: { repoData: IRepoList }) => {
  const [avatarURL, setAvatarURL] = useState("");
  const { full_name, stargazers_count, description, language, owner } =
    props.repoData;

  useEffect(() => {
    axios
      .get(owner.avatar_url, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        const avatar = res.data;
        const avatarBlob = new Blob([avatar]);
        const srcBlob = URL.createObjectURL(avatarBlob);
        setAvatarURL(srcBlob);
      });
  }, []);

  return (
    <Card sx={{ maxWidth: 345, height: 200 }}>
      <CardHeader
        avatar={<Avatar src={avatarURL} />}
        title={
          <div
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              width: "200px",
            }}
          >
            {full_name}
          </div>
        }
      />
      <hr style={{ width: "90%" }}></hr>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <span>&#9733; </span>
            {stargazers_count}
          </Grid>
          <Grid item>{language}</Grid>
          <Grid item container>
            <Grid
              item
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {description}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RepoCardView;
