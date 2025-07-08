
// export default {

//     client_id:  '1076389209414-prc2aid4vikhe2f3ks9nucfidi66q11j.apps.googleusercontent.com',
//     project_id: 'hopeful-ally-437120-f3',
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri:"https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
//     client_secret:"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",
//     redirect_uris:["http://localhost","http://localhost:4207"],
//     javascript_origins:["http://localhost:4207","http://localhost"],
//   };


import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import User from '../app/models/User';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(process.env.GOOGLE_CLIENT_SECRET);
        const user = {
          name: profile.displayName,
          email: profile.emails[0].value,
        };


        return done(null, user);
      }
      catch(err) {
        return (err, null);
      }
    },
  ),
);

// Serialização super‑simples, guarde tudo em cookie de sessão
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
