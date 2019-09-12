const { adminsGuid, vipsGuid } = require('./admins-vips');

// exports.playersQuery = after => `
//                             SELECT
//                               *,
//                               (
//                                 SELECT
//                                   group_concat(al.playerAlias)
//                                 FROM
//                                   players AS pl2
//                                 INNER JOIN aliases AS al ON
//                                   pl2.playerID = al.playerID
//                                 WHERE
//                                   pl2.playerID = pl.playerID
//                                 GROUP BY
//                                   pl2.playerID) AS aliases,
//                             (pl.playerGUID IN (${vipsGuid()})) AS isVip,
//                             (pl.playerGUID IN (${adminsGuid()})) AS isAdmin
//                             FROM
//                               players pl
//                             INNER JOIN
//                               statistics st ON
//                               pl.playerID = st.playerID
//                             WHERE pl.lastActivityDate > ${after}
//                             `;

exports.searchPlayersQuery = (search, limit, offset) => `
                            SELECT
                              *,
                              (
                                SELECT
                                  group_concat(al.playerAlias)
                                FROM
                                  players AS pl2
                                INNER JOIN aliases AS al ON
                                  pl2.playerID = al.playerID
                                WHERE
                                  pl2.playerID = pl.playerID
                                GROUP BY
                                  pl2.playerID) AS aliases,
                            (pl.playerGUID IN (${vipsGuid()})) AS isVip,
                            (pl.playerGUID IN (${adminsGuid()})) AS isAdmin
                            FROM
                              players pl
                            INNER JOIN
                              statistics st ON
                              pl.playerID = st.playerID
                            WHERE pl.playerGUID like "%${search}%" OR aliases like "%${search}%"
                            ORDER BY pl.lastActivityDate DESC
                            LIMIT ${limit} OFFSET ${offset}
                            `;
exports.playerByIdQuery = id => `
                            SELECT
                              *,
                              (
                                SELECT
                                  group_concat(al.playerAlias)
                                FROM
                                  players AS pl2
                                INNER JOIN aliases AS al ON
                                  pl2.playerID = al.playerID
                                WHERE
                                  pl2.playerID = pl.playerID
                                GROUP BY
                                  pl2.playerID) AS aliases,
                            (pl.playerGUID IN (${vipsGuid()})) AS isVip,
                            (pl.playerGUID IN (${adminsGuid()})) AS isAdmin
                            FROM
                              players pl
                            INNER JOIN
                              statistics st ON
                              pl.playerID = st.playerID
                            WHERE pl.playerGUID = "${id}" OR pl.playerID = "${id}"
`;

exports.vipsQuery = () => `
                            SELECT
                              *,
                              (
                                SELECT
                                  group_concat(al.playerAlias)
                                FROM
                                  players AS pl2
                                INNER JOIN aliases AS al ON
                                  pl2.playerID = al.playerID
                                WHERE
                                  pl2.playerID = pl.playerID
                                GROUP BY
                                  pl2.playerID) AS aliases,
                            (pl.playerGUID IN (${vipsGuid()})) AS isVip,
                            (pl.playerGUID IN (${adminsGuid()})) AS isAdmin
                            FROM
                              players pl
                            INNER JOIN
                              statistics st ON
                              pl.playerID = st.playerID
                            WHERE pl.playerGUID IN (${vipsGuid()})
                            ORDER BY pl.lastActivityDate DESC
`;

exports.adminsQuery = () => `
                            SELECT
                              *,
                              (
                                SELECT
                                  group_concat(al.playerAlias)
                                FROM
                                  players AS pl2
                                INNER JOIN aliases AS al ON
                                  pl2.playerID = al.playerID
                                WHERE
                                  pl2.playerID = pl.playerID
                                GROUP BY
                                  pl2.playerID) AS aliases,
                            (pl.playerGUID IN (${vipsGuid()})) AS isVip,
                            (pl.playerGUID IN (${adminsGuid()})) AS isAdmin
                            FROM
                              players pl
                            INNER JOIN
                              statistics st ON
                              pl.playerID = st.playerID
                            WHERE pl.playerGUID IN (${adminsGuid()})
                            ORDER BY pl.lastActivityDate DESC
`;
