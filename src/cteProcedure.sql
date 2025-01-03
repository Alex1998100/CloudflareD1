BEGIN
  RETURN QUERY
  WITH RECURSIVE x AS (
    SELECT i, parent, id, name, type, '' AS path
    FROM entry 
    WHERE name = enter
    UNION ALL
    SELECT e.i, e.parent, e.id, e.name, e.type, (x.path || '/' || e.name) AS path
    FROM entry e, x 
    WHERE x.id = e.parent
  )
  SELECT x.i AS reti, x.id AS retid, x.name AS retname, types.mime AS retmime, x.path AS retpath
  FROM x 
  JOIN types ON types.i = x.type
  WHERE x.path = request;
END;