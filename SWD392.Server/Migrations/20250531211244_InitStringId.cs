using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SWD392.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitStringId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Programs",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    admission_requirements = table.Column<string>(type: "text", nullable: false),
                    tuition_fee = table.Column<string>(type: "text", nullable: false),
                    dormitory_info = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Programs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Student",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Student", x => x.id);
                    table.ForeignKey(
                        name: "FK_Student_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    student_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    programs_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    submission_data = table.Column<string>(type: "jsonb", nullable: false),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Programsid = table.Column<string>(type: "character varying(50)", nullable: true),
                    Userid = table.Column<string>(type: "character varying(50)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.id);
                    table.ForeignKey(
                        name: "FK_Applications_Programs_Programsid",
                        column: x => x.Programsid,
                        principalTable: "Programs",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Applications_Programs_programs_id",
                        column: x => x.programs_id,
                        principalTable: "Programs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Applications_Student_Userid",
                        column: x => x.Userid,
                        principalTable: "Student",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Applications_Student_student_id",
                        column: x => x.student_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    student_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    consultant_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Userid = table.Column<string>(type: "character varying(50)", nullable: true),
                    Userid1 = table.Column<string>(type: "character varying(50)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_Appointments_Student_Userid",
                        column: x => x.Userid,
                        principalTable: "Student",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_Student_Userid1",
                        column: x => x.Userid1,
                        principalTable: "Student",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_Student_consultant_id",
                        column: x => x.consultant_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Student_student_id",
                        column: x => x.student_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    published_by = table.Column<string>(type: "character varying(50)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.id);
                    table.ForeignKey(
                        name: "FK_Articles_Student_published_by",
                        column: x => x.published_by,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Email_verifications",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    userid = table.Column<string>(type: "character varying(50)", nullable: false),
                    verification_code = table.Column<string>(type: "text", nullable: false),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Email_verifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_Email_verifications_Student_userid",
                        column: x => x.userid,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    student_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    consultant_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: false),
                    response = table.Column<string>(type: "text", nullable: false),
                    resolved = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Userid = table.Column<string>(type: "character varying(50)", nullable: true),
                    Userid1 = table.Column<string>(type: "character varying(50)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedback", x => x.id);
                    table.ForeignKey(
                        name: "FK_Feedback_Student_Userid",
                        column: x => x.Userid,
                        principalTable: "Student",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Feedback_Student_Userid1",
                        column: x => x.Userid1,
                        principalTable: "Student",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Feedback_Student_consultant_id",
                        column: x => x.consultant_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Feedback_Student_student_id",
                        column: x => x.student_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    user_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    purpose = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    vnp_txn_ref = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    vnp_response_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    vnp_order_info = table.Column<string>(type: "text", nullable: false),
                    vnp_pay_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.id);
                    table.ForeignKey(
                        name: "FK_Payments_Student_user_id",
                        column: x => x.user_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    student_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    consultant_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    subject = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.id);
                    table.ForeignKey(
                        name: "FK_Tickets_Student_consultant_id",
                        column: x => x.consultant_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_Student_student_id",
                        column: x => x.student_id,
                        principalTable: "Student",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_programs_id",
                table: "Applications",
                column: "programs_id");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_Programsid",
                table: "Applications",
                column: "Programsid");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_student_id",
                table: "Applications",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_Userid",
                table: "Applications",
                column: "Userid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_consultant_id",
                table: "Appointments",
                column: "consultant_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_student_id",
                table: "Appointments",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_Userid",
                table: "Appointments",
                column: "Userid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_Userid1",
                table: "Appointments",
                column: "Userid1");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_published_by",
                table: "Articles",
                column: "published_by");

            migrationBuilder.CreateIndex(
                name: "IX_Email_verifications_userid",
                table: "Email_verifications",
                column: "userid");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_consultant_id",
                table: "Feedback",
                column: "consultant_id");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_student_id",
                table: "Feedback",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_Userid",
                table: "Feedback",
                column: "Userid");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_Userid1",
                table: "Feedback",
                column: "Userid1");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_user_id",
                table: "Payments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Student_RoleId",
                table: "Student",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_consultant_id",
                table: "Tickets",
                column: "consultant_id");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_student_id",
                table: "Tickets",
                column: "student_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DropTable(
                name: "Email_verifications");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Programs");

            migrationBuilder.DropTable(
                name: "Student");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
