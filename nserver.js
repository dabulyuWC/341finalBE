/*jslint node:true*/

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var oracledb = require("oracledb");
var cors = require("cors");
var moment = require("moment");
// Use body parser to parse JSON body
app.use(bodyParser.json());
app.use(cors());
var connAttrs = {
  user: "deneme",
  password: "1",
  connectString: "localhost:1521/XE"
};

app.get("/patientinfo", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      `select p.f_name,p.l_name,h.hospital_name,h.h_department,p.patient_address,p.patient_number  
          from patient p,hospital h,GO_TO g,medical_examination m,HAS2 b  
         where p.patient_ID=b.Pat_ID  
         and b.Ex_ID=m.Exam_ID  
         and g.Exa_ID=m.Exam_ID  
        and g.hos_ID=h.hospital_ID`,
      {},
      {
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          res.set("Content-Type", "application/json");
          res.status(500).send(
            JSON.stringify({
              status: 500,
              message: "Error getting the user profile",
              detailed_message: err.message
            })
          );
        } else {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("GET /user_profiles : Connection released");
          }
        });
      }
    );
  });
});
app.get("/doctor", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      "SELECT * FROM DOCTOR",
      {},
      {
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          res.set("Content-Type", "application/json");
          res.status(500).send(
            JSON.stringify({
              status: 500,
              message: "Error getting the user profile",
              detailed_message: err.message
            })
          );
        } else {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("GET /doctor : Connection released");
          }
        });
      }
    );
  });
});

app.get("/family", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      `select f.DTIME,f.PATIENT_LNAME,f.ADDRESS,f.TREATMENT, p.f_name ||' '|| p.l_name as isimsoyisim
      from patient p,FAMILY_INFORMATION f  
     where p.patient_ID=f.P_ID`,
      {},
      {
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          res.set("Content-Type", "application/json");
          res.status(500).send(
            JSON.stringify({
              status: 500,
              message: "Error getting the user profile",
              detailed_message: err.message
            })
          );
        } else {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("GET /FAMILY : Connection released");
          }
        });
      }
    );
  });
});
// Http Method: GET
// URI        : /user_profiles
// Read all the user profiles
app.get("/patient_profiles", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      "SELECT * FROM PATIENT",
      {},
      {
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          res.set("Content-Type", "application/json");
          res.status(500).send(
            JSON.stringify({
              status: 500,
              message: "Error getting the user profile",
              detailed_message: err.message
            })
          );
        } else {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("GET /user_profiles : Connection released");
          }
        });
      }
    );
  });
});

// Http method: GET
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get("/user_profiles/:USER_NAME", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      "SELECT * FROM USER_PROFILES WHERE USER_NAME = :USER_NAME",
      [req.params.USER_NAME],
      {
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err || result.rows.length < 1) {
          res.set("Content-Type", "application/json");
          var status = err ? 500 : 404;
          res.status(status).send(
            JSON.stringify({
              status: status,
              message: err
                ? "Error getting the user profile"
                : "User doesn't exist",
              detailed_message: err ? err.message : ""
            })
          );
        } else {
          res
            .contentType("application/json")
            .status(200)
            .send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(
              "GET /user_profiles/" +
                req.params.USER_NAME +
                " : Connection released"
            );
          }
        });
      }
    );
  });
});

app.post("/hospital", function(req, res) {
  "use strict";
  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null
        })
      );
    return;
  }
  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message
          })
        );
      return;
    }
    connection.execute(
      "INSERT INTO HOSPITAL VALUES " +
        "(:HOSPITAL_ID, :HOSPITAL_NAME,:H_DEPARTMENT)",
      [req.body.HOSPITAL_ID, req.body.HOSPITAL_NAME, req.body.H_DEPARTMENT],
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message:
                err.message.indexOf("ORA-00001") > -1
                  ? "User already exists"
                  : "Input Error",
              detailed_message: err.message
            })
          );
        } else {
          // Successfully created the resource
          res
            .status(201)
            // .set("Location", "/patient_profiles/" + req.body.F_NAME)
            .send(
              JSON.stringify({
                status: 200,
                message: result
              })
            );
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /family : Connection released");
          }
        });
      }
    );
  });
});

app.post("/family", function(req, res) {
  "use strict";
  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null
        })
      );
    return;
  }
  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message
          })
        );
      return;
    }
    connection.execute(
      "INSERT INTO FAMILY_INFORMATION VALUES " +
        "(:FAMILY_ID,:DTIME,:PATIENT_LNAME,:ADDRESS,:TREATMENT,:P_ID  )",
      [
        req.body.FAMILY_ID,
        moment(req.body.DTIME).toDate(),
        req.body.PATIENT_LNAME,
        req.body.ADDRESS,
        req.body.TREATMENT,
        req.body.P_ID
      ],
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message:
                err.message.indexOf("ORA-00001") > -1
                  ? "User already exists"
                  : "Input Error",
              detailed_message: err.message
            })
          );
        } else {
          // Successfully created the resource
          res
            .status(201)
            // .set("Location", "/patient_profiles/" + req.body.F_NAME)
            .send(
              JSON.stringify({
                status: 200,
                message: result
              })
            );
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /family : Connection released");
          }
        });
      }
    );
  });
});

app.post("/doctor", function(req, res) {
  "use strict";
  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null
        })
      );
    return;
  }
  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message
          })
        );
      return;
    }
    connection.execute(
      "INSERT INTO DOCTOR VALUES " +
        "(:DOCTOR_ID,:DF_NAME, :DL_NAME, :DOCTOR_MAIL, :DOCTOR_ADDRESS," +
        ":DOCTOR_NUMBER) ",
      [
        req.body.DOCTOR_ID,
        req.body.DF_NAME,
        req.body.DL_NAME,
        req.body.DOCTOR_MAIL,
        req.body.DOCTOR_ADDRESS,
        req.body.DOCTOR_NUMBER
      ],
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message:
                err.message.indexOf("ORA-00001") > -1
                  ? "User already exists"
                  : "Input Error",
              detailed_message: err.message
            })
          );
        } else {
          // Successfully created the resource
          res
            .status(201)
            // .set("Location", "/patient_profiles/" + req.body.F_NAME)
            .send(
              JSON.stringify({
                status: 200,
                message: result
              })
            );
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /doctor : Connection released");
          }
        });
      }
    );
  });
});
// Http method: POST
// URI        : /user_profiles
// Creates a new user profile
app.post("/patient_profiles", function(req, res) {
  "use strict";
  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null
        })
      );
    return;
  }
  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message
          })
        );
      return;
    }
    connection.execute(
      "INSERT INTO PATIENT VALUES " +
        "(:PATIENT_ID,:F_NAME, :L_NAME, :PATIENT_NUMBER, :PATIENT_ADDRESS," +
        ":J_DATE, :D_ID) ",
      [
        req.body.PATIENT_ID,
        req.body.F_NAME,
        req.body.L_NAME,
        req.body.PATIENT_NUMBER,
        req.body.PATIENT_ADDRESS,
        new Date(req.body.J_DATE),
        req.body.D_ID
      ],
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message:
                err.message.indexOf("ORA-00001") > -1
                  ? "User already exists"
                  : "Input Error",
              detailed_message: err.message
            })
          );
        } else {
          // Successfully created the resource
          res
            .status(201)
            // .set("Location", "/patient_profiles/" + req.body.F_NAME)
            .send(
              JSON.stringify({
                status: 200,
                message: result
              })
            );
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /patient_profiles : Connection released");
          }
        });
      }
    );
  });
});

// Build UPDATE statement and prepare bind variables
var buildUpdateStatement = function buildUpdateStatement(req) {
  "use strict";

  var statement = "",
    bindValues = {};
  if (req.body.DISPLAY_NAME) {
    statement += "DISPLAY_NAME = :DISPLAY_NAME";
    bindValues.DISPLAY_NAME = req.body.DISPLAY_NAME;
  }
  if (req.body.DESCRIPTION) {
    if (statement) statement = statement + ", ";
    statement += "DESCRIPTION = :DESCRIPTION";
    bindValues.DESCRIPTION = req.body.DESCRIPTION;
  }
  if (req.body.GENDER) {
    if (statement) statement = statement + ", ";
    statement += "GENDER = :GENDER";
    bindValues.GENDER = req.body.GENDER;
  }
  if (req.body.AGE) {
    if (statement) statement = statement + ", ";
    statement += "AGE = :AGE";
    bindValues.AGE = req.body.AGE;
  }
  if (req.body.COUNTRY) {
    if (statement) statement = statement + ", ";
    statement += "COUNTRY = :COUNTRY";
    bindValues.COUNTRY = req.body.COUNTRY;
  }
  if (req.body.THEME) {
    if (statement) statement = statement + ", ";
    statement += "THEME = :THEME";
    bindValues.THEME = req.body.THEME;
  }

  statement += " WHERE USER_NAME = :USER_NAME";
  bindValues.USER_NAME = req.params.USER_NAME;
  statement = "UPDATE USER_PROFILES SET " + statement;

  return {
    statement: statement,
    bindValues: bindValues
  };
};

// Http method: PUT
// URI        : /user_profiles/:USER_NAME
// Update the profile of user given in :USER_NAME
app.put("/patient_profiles/:PATIENT_ID", function(req, res) {
  "use strict";

  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null
        })
      );
    return;
  }

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message
          })
        );
      return;
    }

    var updateStatement = buildUpdateStatement(req);
    connection.execute(
      updateStatement.statement,
      updateStatement.bindValues,
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT // Return the result as Object
      },
      function(err, result) {
        if (err || result.rowsAffected === 0) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message: err ? "Input Error" : "User doesn't exist",
              detailed_message: err ? err.message : ""
            })
          );
        } else {
          // Resource successfully updated. Sending an empty response body.
          res.status(204).end();
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(
              "PUT /patient_profiles/" +
                req.params.PATIENT_ID +
                " : Connection released "
            );
          }
        });
      }
    );
  });
});

// Http method: DELETE
// URI        : /userprofiles/:USER_NAME
// Delete the profile of user given in :USER_NAME
app.delete("/patient_profiles/:PATIENT_ID", function(req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function(err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message
        })
      );
      return;
    }

    connection.execute(
      "DELETE FROM PATIENT WHERE PATIENT_ID = :PATIENT_ID",
      [req.params.PATIENT_ID],
      {
        autoCommit: true,
        outFormat: oracledb.OBJECT
      },
      function(err, result) {
        if (err || result.rowsAffected === 0) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message: err ? "Input Error" : "User doesn't exist",
              detailed_message: err ? err.message : ""
            })
          );
        } else {
          // Resource successfully deleted. Sending an empty response body.

          res.status(204).end();
        }
        // Release the connection
        connection.release(function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(
              "DELETE /user_profiles/" +
                req.params.PATIENT_ID +
                " : Connection released"
            );
          }
        });
      }
    );
  });
});

var server = app.listen(3000, function() {
  "use strict";

  var host = server.address().address,
    port = server.address().port;

  console.log(" Server is listening at http://%s:%s", host, port);
});
