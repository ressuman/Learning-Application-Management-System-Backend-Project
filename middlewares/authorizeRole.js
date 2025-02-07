import asyncHandler from "./asyncHandler.js";
import IndexError from "./indexError.js";

export const authorizeRole = (requiredRole) =>
  asyncHandler(async (req, res, next) => {
    // const { role } = req.user || req.admin; // Get role from decoded token
    const role = req.user?.role || req.admin?.role;

    if (!role) {
      return next(
        new IndexError("Access denied. Please log in. No role found", 401)
      );
    }

    // Allow access if:
    // - The user has the required role
    // - OR the user is an admin accessing a user-specific route
    if (role !== requiredRole && role !== "admin") {
      return next(
        new IndexError(
          `Access denied. You do not have permission to access this resource. Required role: ${requiredRole}`,
          403
        )
      );
    }

    next();
  });

// export const authorizeRole = (role) => {
//   return (req, res, next) => {
//     if (req.user && role === "user") {
//       return next(); // Allow access if user is authenticated
//     }

//     if (req.admin && role === "admin") {
//       return next(); // Allow access if admin is authenticated
//     }

//     return res.status(403).json({
//       status: "fail",
//       message: "You do not have permission to access this resource.",
//     });
//   };
// };

// export const authorize = (role) =>
//   asyncHandler(async (req, res, next) => {
//     if (role === "admin") {
//       // Admin access: Ensure the request is coming from an authenticated admin
//       if (!req.admin) {
//         return next(new IndexError("Access denied. Admins only.", 403));
//       }
//     } else if (role === "user") {
//       // Allow if either a user or admin is authenticated
//       if (!req.user && !req.admin) {
//         return next(new IndexError("Access denied. Users only.", 403));
//       }
//     }

//     next();
//   });
