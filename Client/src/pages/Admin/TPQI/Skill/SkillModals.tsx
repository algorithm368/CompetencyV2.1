import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select, LoadingButton } from "@Components/Common/ExportComponent";

interface AddEditSkillModalProps {
    isOpen: boolean;
    mode: "add" | "edit";
    initialSkillText: string;
    initialSkillId: number | null;
    skillOptions: { label: string; value: number }[];
    onClose: () => void;
    onConfirm: (skillText: string, subcategoryId: number | null) => void;
    isLoading?: boolean;
}

export const AddEditSkillModal: React.FC<AddEditSkillModalProps> = ({ isOpen, mode, initialSkillText, initialSkillId, skillOptions, onClose, onConfirm, isLoading = false }) => {
    const [skillText, setSkillText] = useState(initialSkillText);
    const [skillId, setSkillId] = useState<number | null>(initialSkillId);

    useEffect(() => {
        setSkillText(initialSkillText);
        setSkillId(initialSkillId);
    }, [initialSkillText, initialSkillId]);

    return (
        <Modal
            className="z-50"
            isOpen={isOpen}
            onClose={onClose}
            title={mode === "add" ? "Add Skill" : "Edit Skill"}
            actions={
                <>
                    <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <LoadingButton onClick={() => onConfirm(skillText, skillId)} isLoading={isLoading} loadingText={mode === "add" ? "Creating..." : "Saving..."}>
                        {mode === "add" ? "Create" : "Save"}
                    </LoadingButton>
                </>
            }
        >
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="block text-sm mb-1 ml-0.5">Skill Text</label>
                    <Input value={skillText} className="!rounded-xl" onChange={(e) => setSkillText(e.target.value)} disabled={isLoading} />
                </div>
                <div className="flex flex-col">
                    <label className="block text-sm mb-1 ml-0.5">Skill</label>
                    <Select
                        value={skillId !== null ? skillId : ""}
                        options={skillOptions}
                        onChange={(val) => setSkillId(val === "" ? null : (val as number))}
                        disabled={isLoading}
                        className="!rounded-xl"
                        placeholder="Select skill"
                    />
                </div>
            </div>
        </Modal>
    );
}