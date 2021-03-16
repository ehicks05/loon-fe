import React, { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserContext } from "./common/UserContextProvider";

import SystemSettings from "./components/routes/SystemSettings";
import Playlist from "./components/routes/Playlist";
import Playlists from "./components/routes/Playlists";
import GeneralSettings from "./components/routes/GeneralSettings";
import Eq from "./components/routes/Eq";
import PlaylistBuilder from "./components/routes/PlaylistBuilder";
import UserSettings from "./components/routes/UserSettings";
import About from "./components/routes/About";
import Artists from "./components/routes/Artists";
import Albums from "./components/routes/Albums";
import Artist from "./components/routes/Artist";
import Search from "./components/routes/Search";
import Album from "./components/routes/Album";

export default function Routes() {
  const userContext = useContext(UserContext);
  const isAdmin = userContext.user.admin;

  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/search" />} />
      <AdminRoute
        exact
        path="/admin/systemSettings"
        appProps={{ isAdmin }}
        component={SystemSettings}
      />
      <AdminRoute
        exact
        path="/admin/users"
        appProps={{ isAdmin }}
        component={UserSettings}
      />
      <AdminRoute
        exact
        path="/admin/about"
        appProps={{ isAdmin }}
        component={About}
      />
      <Route
        exact
        path="/settings/general"
        render={() => <GeneralSettings />}
      />
      <Route exact path="/settings/eq" render={() => <Eq />} />
      <Route exact path="/albums" render={() => <Albums />} />
      <Route exact path="/artists" render={() => <Artists />} />
      <Route
        exact
        path="/artist/:artist"
        render={(props) => <Artist {...props} />}
      />
      <Route
        exact
        path="/artist/:artist/album/:album"
        render={(props) => <Album {...props} />}
      />
      <Route exact path="/search" render={(props) => <Search {...props} />} />
      <Route
        exact
        path="/favorites"
        render={(props) => <Playlist {...props} />}
      />
      <Route exact path="/queue" render={(props) => <Playlist {...props} />} />

      <Switch>
        <Route
          exact
          path="/playlists/new"
          render={(props) => <PlaylistBuilder {...props} />}
        />
        <Route
          exact
          path="/playlists/:id/edit"
          render={(props) => <PlaylistBuilder {...props} />}
        />

        <Route exact path="/playlists" render={() => <Playlists />} />
        <Route
          exact
          path="/playlists/:id"
          render={(props) => <Playlist {...props} />}
        />
      </Switch>
    </>
  );
}

function AdminRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        appProps.isAdmin ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
}
