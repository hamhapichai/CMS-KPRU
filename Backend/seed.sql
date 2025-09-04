-- Seed Roles
INSERT INTO "Roles" ("RoleName") VALUES ('Admin') ON CONFLICT ("RoleName") DO NOTHING;
INSERT INTO "Roles" ("RoleName") VALUES ('User') ON CONFLICT ("RoleName") DO NOTHING;

-- Seed Departments
INSERT INTO "Departments" ("DepartmentName") VALUES ('ฝ่ายบริหาร') ON CONFLICT ("DepartmentName") DO NOTHING;
INSERT INTO "Departments" ("DepartmentName") VALUES ('ฝ่ายบุคคล') ON CONFLICT ("DepartmentName") DO NOTHING;
INSERT INTO "Departments" ("DepartmentName") VALUES ('ฝ่ายไอที') ON CONFLICT ("DepartmentName") DO NOTHING;
INSERT INTO "Departments" ("DepartmentName") VALUES ('ฝ่ายบัญชี') ON CONFLICT ("DepartmentName") DO NOTHING;

-- Seed Admin User
INSERT INTO "Users" ("Username", "Email", "PasswordHash", "RoleId", "DepartmentId", "IsActive")
SELECT 'admin', 'admin@cms-kpru.local', 'e7cf3ef4f17c3999a94f2c6f612e8a888e5a0e0e5a1b5e5a1b5e5a1b5e5a1b5e5a1b5e5a1b5e5a1b5e5a1b5', r."RoleId", d."DepartmentId", TRUE
FROM "Roles" r, "Departments" d
WHERE r."RoleName" = 'Admin' AND d."DepartmentName" = 'ฝ่ายบริหาร'
ON CONFLICT ("Username") DO NOTHING;
