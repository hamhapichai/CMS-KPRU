using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateComplaintWorkflowTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Departments_AssignedToDeptId",
                table: "ComplaintAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedByUserId",
                table: "ComplaintAssignments");

            migrationBuilder.RenameColumn(
                name: "LogType",
                table: "ComplaintLogs",
                newName: "Action");

            migrationBuilder.RenameColumn(
                name: "Details",
                table: "ComplaintLogs",
                newName: "PreviousStatus");

            migrationBuilder.RenameColumn(
                name: "ConfirmedByDean",
                table: "ComplaintAssignments",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "AISuggestionDeptId",
                table: "ComplaintAssignments",
                newName: "UserId");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "ComplaintLogs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                table: "ComplaintLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NewStatus",
                table: "ComplaintLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "ComplaintLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AssignedToDeptId",
                table: "ComplaintAssignments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AssignedByUserId",
                table: "ComplaintAssignments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssignedToUserId",
                table: "ComplaintAssignments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedDate",
                table: "ComplaintAssignments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedDate",
                table: "ComplaintAssignments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ForwardingNotes",
                table: "ComplaintAssignments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProcessingNotes",
                table: "ComplaintAssignments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedDate",
                table: "ComplaintAssignments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintLogs_DepartmentId",
                table: "ComplaintLogs",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintAssignments_AssignedToUserId",
                table: "ComplaintAssignments",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintAssignments_UserId",
                table: "ComplaintAssignments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Departments_AssignedToDeptId",
                table: "ComplaintAssignments",
                column: "AssignedToDeptId",
                principalTable: "Departments",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedByUserId",
                table: "ComplaintAssignments",
                column: "AssignedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedToUserId",
                table: "ComplaintAssignments",
                column: "AssignedToUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Users_UserId",
                table: "ComplaintAssignments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintLogs_Departments_DepartmentId",
                table: "ComplaintLogs",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "DepartmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Departments_AssignedToDeptId",
                table: "ComplaintAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedByUserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedToUserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAssignments_Users_UserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintLogs_Departments_DepartmentId",
                table: "ComplaintLogs");

            migrationBuilder.DropIndex(
                name: "IX_ComplaintLogs_DepartmentId",
                table: "ComplaintLogs");

            migrationBuilder.DropIndex(
                name: "IX_ComplaintAssignments_AssignedToUserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ComplaintAssignments_UserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "ComplaintLogs");

            migrationBuilder.DropColumn(
                name: "Metadata",
                table: "ComplaintLogs");

            migrationBuilder.DropColumn(
                name: "NewStatus",
                table: "ComplaintLogs");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "ComplaintLogs");

            migrationBuilder.DropColumn(
                name: "AssignedToUserId",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "ClosedDate",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "CompletedDate",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "ForwardingNotes",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "ProcessingNotes",
                table: "ComplaintAssignments");

            migrationBuilder.DropColumn(
                name: "ReceivedDate",
                table: "ComplaintAssignments");

            migrationBuilder.RenameColumn(
                name: "PreviousStatus",
                table: "ComplaintLogs",
                newName: "Details");

            migrationBuilder.RenameColumn(
                name: "Action",
                table: "ComplaintLogs",
                newName: "LogType");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ComplaintAssignments",
                newName: "AISuggestionDeptId");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "ComplaintAssignments",
                newName: "ConfirmedByDean");

            migrationBuilder.AlterColumn<int>(
                name: "AssignedToDeptId",
                table: "ComplaintAssignments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "AssignedByUserId",
                table: "ComplaintAssignments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Departments_AssignedToDeptId",
                table: "ComplaintAssignments",
                column: "AssignedToDeptId",
                principalTable: "Departments",
                principalColumn: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAssignments_Users_AssignedByUserId",
                table: "ComplaintAssignments",
                column: "AssignedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
