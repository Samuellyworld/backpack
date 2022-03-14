import { Suspense } from "react";
import {
  makeStyles,
  Typography,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { KeyringStoreStateEnum } from "../../keyring/store";
import { useKeyringStoreState } from "../../context/KeyringStoreState";
import { SidebarButton } from "./Sidebar";
import { Scrollbar } from "./Scrollbar";
import {
  //  NavigationProvider,
  NavigationStackProvider,
  useNavigationContext,
  useNavigationRender,
} from "../../context/Navigation";
import { UnlockedLoading } from "../Unlocked";

export const NAV_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme: any) => ({
  navBarContainer: {
    height: `${NAV_BAR_HEIGHT}px`,
    borderBottom: `solid 1pt ${theme.custom.colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: theme.custom.colors.nav,
  },
  menuButtonContainer: {
    width: "38px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
  },
  connectedIcon: {
    width: "12px",
    height: "12px",
    borderRadius: "6px",
    backgroundColor: theme.custom.colors.connected,
    position: "absolute",
    right: 0,
  },
  disconnectedIcon: {
    width: "12px",
    height: "12px",
    borderRadius: "6px",
    backgroundColor: theme.custom.colors.disconnected,
    position: "absolute",
    right: 0,
  },
  centerDisplayContainer: {
    color: theme.custom.colors.fontColor,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  connectionButton: {
    padding: 0,
  },
  connectionMenu: {
    backgroundColor: theme.custom.colors.offText,
    color: theme.custom.colors.fontColor,
  },
  overviewLabel: {
    fontSize: "18px",
    fontWeight: 500,
  },
}));

export function WithNav(props: any) {
  return (
    <Suspense fallback={<div></div>}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <NavBar />
        {props.children}
      </div>
    </Suspense>
  );
}

export function WithNavContext(props: any) {
  return (
    <NavigationStackProvider root={props.children}>
      <NavContent />
    </NavigationStackProvider>
  );
}

function NavBar() {
  const classes = useStyles();
  return (
    <div className={classes.navBarContainer}>
      <LeftNavButton />
      <CenterDisplay />
      <RightNavButton />
    </div>
  );
}

function LeftNavButton() {
  const { isRoot } = useNavigationContext();
  return isRoot ? <SidebarButton /> : <NavBackButton />;
}

function RightNavButton() {
  return <DummyButton />;
}

function NavBackButton() {
  const theme = useTheme() as any;
  const { pop } = useNavigationContext();
  return (
    <div style={{ display: "flex", width: "38px" }}>
      <IconButton disableRipple onClick={() => pop()} style={{ padding: 0 }}>
        <ArrowBack style={{ color: theme.custom.colors.secondary }} />
      </IconButton>
    </div>
  );
}

function NavContent() {
  const render = useNavigationRender();
  return (
    <div style={{ flex: 1 }}>
      <Scrollbar>
        <Suspense fallback={<UnlockedLoading />}>{render()}</Suspense>
      </Scrollbar>
    </div>
  );
}

function CenterDisplay() {
  const classes = useStyles();
  const keyringStoreState = useKeyringStoreState();
  const isLocked = keyringStoreState === KeyringStoreStateEnum.Locked;
  return (
    <div className={classes.centerDisplayContainer}>
      {isLocked ? <LockedCenterDisplay /> : <UnlockedCenterDisplay />}
    </div>
  );
}

function LockedCenterDisplay() {
  return (
    <div>
      <b>200ms</b>
    </div>
  );
}

function UnlockedCenterDisplay() {
  return (
    <Suspense fallback={<div></div>}>
      <_UnlockedCenterDisplay />
    </Suspense>
  );
}

function _UnlockedCenterDisplay() {
  const classes = useStyles();
  const { title } = useNavigationContext();
  return <Typography className={classes.overviewLabel}>{title}</Typography>;
}

function DummyButton() {
  const classes = useStyles();
  return <div className={classes.menuButtonContainer}></div>;
}
