import {
  AppBar,
  Button,
  createTheme,
  Dialog,
  Drawer,
  Fab,
  IconButton,
  Slide,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Add, ArrowForward } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect } from "react";
import Poll from "react-polls";
import { isDesktop, isInRoom } from "../../App";
import { colors, token } from "../../util/settings";
import {
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import BlackColorTextField from "../../components/BlackColorTextField";

export let togglePolling = undefined;

let po = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export function PollBox(props) {
  let forceUpdate = useForceUpdate();

  const [open, setOpen] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  let [polls, setPolls] = React.useState(po);
  let [pollQuestion, setPollQuestion] = React.useState("");
  let [pollOptions, setPollOptions] = React.useState([]);
  let [canAddPoll, setCanAddPoll] = React.useState(
    props.membership !== undefined &&
      props.membership !== null &&
      props.membership.canAddPoll === true
  );

  unregisterEvent("membership-updated");
  registerEvent("membership-updated", (mem) => {
    setCanAddPoll(mem.canAddPoll);
  });

  const reloadPolls = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: Number(props.roomId),
        moduleWorkerId: props.moduleWorkerId,
        offset: 0,
        limit: 100,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/poll/get_polls", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.status === "success") {
          result.polls.forEach((poll) => {
            let pollOptions = result.options[poll.id]["options"];
            poll.myVote = result.options[poll.id]["myVote"];
            pollOptions.forEach((opt) => {
              opt.option = opt.caption;
            });
            poll.options = pollOptions;
          });
          po = result.polls;
          setPolls(po);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    reloadPolls();
    unregisterEvent("poll-added");
    registerEvent("poll-added", ({ poll, options }) => {
        /*options.forEach((opt) => {
          opt.option = opt.caption;
        });
        poll.options = options;
        po.push(poll);
        setPolls(po);
        forceUpdate();*/
        reloadPolls();
    });
    registerEvent("vote-added", ({ poll, options }) => {
      let p = undefined;
      for (let i = 0; i < po.length; i++) {
        if (po[i].id === poll.id) {
          p = po[i];
          break;
        }
      }
      let pollOptions = options["options"];
      for (let i = 0; i < pollOptions.length; i++) {
        p.options[i].votes = pollOptions[i].votes;
        p.options[i].option = p.options[i].caption;
      }

      console.log(po);
      console.log(poll);
      setPolls(po);
      forceUpdate();
    });
  }, []);

  let handleVote = (voteAnswer, pollIndex) => {
    let optionIndex = 0;
    for (let i = 0; i < polls[pollIndex].options.length; i++) {
      if (polls[pollIndex].options[i].option === voteAnswer) {
        optionIndex = i;
        break;
      }
    }

    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
        moduleWorkerId: props.moduleWorkerId,
        pollId: Number(polls[pollIndex].id),
        optionId: Number(polls[pollIndex].options[optionIndex].id),
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/poll/vote", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.status === "success") {
          po[pollIndex].myVote = result.vote;
          setPolls(po);
        }
      })
      .catch((error) => console.log("error", error));
  };

  togglePolling = () => setAddOpen(!addOpen);

  let theme = createTheme({
    palette: {
      primary: {
        main: "rgba(75, 134, 180, 0.75)",
      },
      secondary: {
        main: "#000",
      },
    },
  });

  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: "blur(10px)",
        },
      }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: isDesktop() ? "0 0 24px 24px" : undefined,
          backdropFilter: "blur(15px)",
        }}
      >
      <AppBar
        style={{
          width: isDesktop() ? 550 : "100%",
          height: 64,
          borderRadius: isDesktop() ? "0 0 24px 24px" : 0,
          backgroundColor: colors.primaryMedium,
          backdropFilter: "blur(10px)",
          position: "fixed",
          left: isDesktop() && isInRoom() ? "calc(50% - 225px)" : "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Toolbar
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            direction: 'rtl'
          }}
        >
        <IconButton
          onClick={() => {
            handleClose();
          }}
        >
          <ArrowForward style={{ fill: colors.oposText }} />
        </IconButton>
          <Typography
            variant={"h6"}
            style={{ color: colors.oposText, flex: 1, textAlign: 'right' }}
          >
            سالن کنفرانس
          </Typography>
        </Toolbar>
      </AppBar>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 64px)",
            backgroundColor: colors.backSide,
            marginTop: 64
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            {polls.map((poll, index) => {
              if (poll.myVote !== undefined && poll.myVote !== null) {
                let myVoteText = "";
                for (let i = 0; i < poll.options.length; i++) {
                  if (poll.options[i].id === poll.myVote.optionId) {
                    myVoteText = poll.options[i].option;
                    break;
                  }
                }
                return (
                  <Poll
                    question={poll.question}
                    answers={poll.options}
                    onVote={(va) => handleVote(va, index)}
                    noStorage={true}
                    vote={myVoteText}
                  />
                );
              } else {
                return (
                  <Poll
                    question={poll.question}
                    answers={poll.options}
                    onVote={(va) => handleVote(va, index)}
                    noStorage={true}
                  />
                );
              }
            })}
          </div>
          {canAddPoll === true ? (
            <Fab
              color={"secondary"}
              style={{ position: "fixed", bottom: 16, left: 16 }}
              onClick={() => setAddOpen(true)}
            >
              <Add />
            </Fab>
          ) : null}
        </div>
        <Drawer
          onClose={() => setAddOpen(false)}
          open={addOpen}
          anchor={"right"}
          style={{ display: canAddPoll ? "block" : "none" }}
        >
          <div
            style={{
              background: colors.primaryLight,
              backdropFilter: 'blur(10px)',
              width: 360,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <Typography
                variant={"h6"}
                style={{ color: colors.text, marginTop: 24, marginRight: 16 }}
              >
                افزودن رای گیری جدید
              </Typography>
            </div>
            <div>
              <BlackColorTextField
                label="متن سوال"
                variant="outlined"
                color={"secondary"}
                style={{ marginRight: 32, marginTop: 24, color: colors.text }}
                defaultValue={pollQuestion}
                onChange={(event) => {
                  setPollQuestion(event.target.value);
                }}
              />
              {pollOptions.map((option, index) => {
                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        width: "calc(100% - 48px)",
                        marginLeft: 38,
                      }}
                    >
                      <BlackColorTextField
                        label={"گزینه ی" + " " + (index + 1)}
                        variant="outlined"
                        color={"secondary"}
                        style={{ marginRight: 12, marginTop: 16, color: colors.text }}
                        defaultValue={pollOptions[index].caption}
                        onChange={(event) => {
                          let options = pollOptions;
                          options[index].caption = event.target.value;
                          setPollOptions(options);
                          forceUpdate();
                        }}
                      />
                      <IconButton
                        style={{ color: colors.icon }}
                        onClick={() => {
                          let options = pollOptions;
                          options.splice(index, 1);
                          setPollOptions(options);
                          forceUpdate();
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </>
                );
              })}
              <br />
              <Button
                variant={"outlined"}
                style={{
                  color: colors.text,
                  width: 246,
                  height: 56,
                  marginTop: 16,
                  marginRight: 24,
                }}
                onClick={() => {
                  let options = pollOptions;
                  options.push({ id: options.length, caption: "" });
                  setPollOptions(options);
                  forceUpdate();
                }}
              >
                افزودن گزینه
              </Button>
            </div>
            <div
              style={{
                position: "fixed",
                bottom: 24,
                right: 0,
                display: "flex",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <ThemeProvider theme={theme}>
                <Button
                  variant={"outlined"}
                  style={{ margin: 8, color: colors.text, borderColor: colors.text }}
                  onClick={() => setAddOpen(false)}
                >
                  لغو
                </Button>
                <Button
                  style={{ margin: 8, color: colors.text, borderColor: colors.text }}
                  color="secondary"
                  variant={"outlined"}
                  onClick={() => {
                    let requestOptions = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        token: token,
                      },
                      body: JSON.stringify({
                        roomId: props.roomId,
                        moduleWorkerId: props.moduleWorkerId,
                        question: pollQuestion,
                        options: pollOptions.map((o) => o.caption),
                      }),
                      redirect: "follow",
                    };
                    fetch(serverRoot + "/poll/add_poll", requestOptions)
                      .then((response) => response.json())
                      .then((result) => {
                        console.log(JSON.stringify(result));
                        if (result.status === "success") {
                          setAddOpen(false);
                        }
                      })
                      .catch((error) => console.log("error", error));
                  }}
                >
                  تایید
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </Drawer>
      </div>
    </Dialog>
  );
}
