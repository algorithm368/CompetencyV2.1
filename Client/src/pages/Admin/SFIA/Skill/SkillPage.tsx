import { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { AdminLayout } from "@Layouts/AdminLayout";
import { RowActions, Button, Input, Toast, DataTable } from "@Components/Common/ExportComponent";
import { useSkillManager } from "@Hooks/admin/sfia/useSkillHooks";
import { Skill, CreateSkillDto, UpdateSkillDto } from "@Types/sfia/skillTypes";
import { AddEditSkillModal, DeleteSkillModal } from "./SkillModals";

export default function SkillPage(){
    
}