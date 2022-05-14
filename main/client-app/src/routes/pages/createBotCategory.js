import { Fab, Paper } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { Done } from "@material-ui/icons";
import { Rating } from "@mui/material";
import React, { useEffect } from "react";
import { setBottomSheetContent, setBSO, setOnBsClosed } from "../../App";
import ProfileEditField from "../../components/ProfileEditField";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";

export default function CreateBotCategoryPage(props) {

  const handleClose = () => {
    setBSO(false);
    setTimeout(() => {
      setBottomSheetContent(null);
      props.onClose();
    }, 250);
  };

  useEffect(() => {
    setOnBsClosed(handleClose);
    setBottomSheetContent(
      <div style={{ width: "100%", height: 250, direction: "rtl" }}>
        <Fab
          style={{
            zIndex: 99999,
            position: "absolute",
            left: "calc(50% - 150px)",
            transform: "translate(-50%, 72px)",
            backgroundColor: colors.accent,
          }}
          onClick={() => {
            let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  title: document.getElementById('botCategoryTitle').value
                }),
                redirect: 'follow',
            }
            fetch(serverRoot + '/bot/create_category', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === 'success') {
                        handleClose();
                    }
                    else {
                        alert(result.message);
                    }
                });
          }}
        >
          <Done />
        </Fab>
        <Paper
          style={{
            borderRadius: "24px 24px 0 0",
            width: "100%",
            height: "calc(100% - 75px)",
            position: "absolute",
            top: 100,
            left: 0,
            background: colors.primaryMedium,
            backdropFilter: colors.blur,
          }}
        >
          <ProfileEditField
            id="botCategoryTitle"
            placeholder="عنوان دسته"
            style={{
              marginTop: 56,
              marginLeft: 32,
              marginRight: 32,
              width: "calc(100% - 64px)",
              height: 48,
              color: "#fff",
              paddingLeft: 16,
              paddingRight: 16,
            }}
          />
        </Paper>
      </div>
    );
    setBSO(true);
  }, []);
  return null;
}
