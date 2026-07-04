-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actor_id" INTEGER,
    "actor_name" TEXT,
    "actor_role" TEXT,
    "target_id" INTEGER,
    "target_name" TEXT,
    "employee_id" INTEGER,
    "department_id" INTEGER,
    "metadata" JSONB,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "is_admin_only" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_logs_module_created_at_idx" ON "activity_logs"("module", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_employee_id_created_at_idx" ON "activity_logs"("employee_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");
