// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Auth = require("../models/User");
// const jwt = require("jsonwebtoken");
// const { OAuth2Client } = require("google-auth-library");

// // Initialize the OAuth client
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // Function to verify Google ID tokens (for frontend direct integration)
// const verifyGoogleToken = async (token) => {
//   try {
//     // Verify the token with Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const googleId = payload.sub;

//     // Find or create user
//     let user = await Auth.findOne({ googleId });

//     if (!user) {
//       user = new Auth({
//         name: payload.name,
//         email: payload.email,
//         username: payload.email.split("@")[0],
//         phone: "N/A",
//         googleId,
//         emailVerified: true,
//       });
//       await user.save();
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Return user and token
//     return {
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//         role: user.role,
//       },
//       token: jwtToken,
//     };
//   } catch (error) {
//     console.error("Google auth error:", error);
//     throw new Error("Google authentication failed");
//   }
// };

// // Create the main passport configuration function
// const configurePassport = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:5000/api/googleauth/google/callback",
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await Auth.findOne({ googleId: profile.id });

//           if (!user) {
//             user = new Auth({
//               name: profile.displayName,
//               email: profile.emails[0].value,
//               username: profile.emails[0].value.split("@")[0], // Use email as username
//               googleId: profile.id,
//               emailVerified: true,
//             });
//             await user.save();
//           }

//           // Generate a JWT token
//           const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "7d",
//           });

//           // Pass user.id for serialization and store token elsewhere (e.g., in a session or as a cookie)
//           return done(null, { userId: user._id, token }); // Store only the userId in session
//         } catch (error) {
//           return done(error, null);
//         }
//       }
//     )
//   );

//   // Serialize user to store in session
//   passport.serializeUser((user, done) => {
//     done(null, user.userId); // Use userId, not the full user object
//   });

//   // Deserialize user from session
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await Auth.findById(id); // Retrieve user by userId (which is _id in Mongo)
//       done(null, user); // Pass the user object
//     } catch (error) {
//       done(error, null);
//     }
//   });
// };

// // Export both the passport configuration function and verifyGoogleToken
// module.exports = configurePassport;
// module.exports.verifyGoogleToken = verifyGoogleToken;
