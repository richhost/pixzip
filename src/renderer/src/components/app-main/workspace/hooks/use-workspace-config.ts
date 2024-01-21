import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { currentWksID } from "~/atoms/wroksapce.ts";
import { useWorkspace } from "~/hooks/use-workspace.ts";
import { ConfigFormData, FormDataSchema } from "~/lib/schema";

const initState: ConfigFormData = {
  name: "",
  icon: "",
  width: undefined,
  height: undefined,
  suffix: "-min",
  format: "original",
  level: 1,
  autoExec: true,
  originalOutput: true,
  outputDir: "",
};

export function useWorkspaceConfig() {
  const currWksID = useAtomValue(currentWksID);
  const { workspaces, del } = useWorkspace();

  const [formData, setFormData] = useState<ConfigFormData>(initState);

  const currentWks = useMemo(() => {
    return workspaces.find((w) => w.id === currWksID) || workspaces[0];
  }, [workspaces, currWksID]);

  const [previewCurrentWks, setPreviewCurrentWks] =
    useState<Pixzip.Workspace>();

  const normalizedFormData = useCallback((workspace: Pixzip.Workspace) => {
    const data = FormDataSchema.parse(workspace);
    setFormData(data);
  }, []);

  if (currentWks !== previewCurrentWks) {
    setPreviewCurrentWks(currentWks);
    normalizedFormData(currentWks);
  }

  const settingFormData = useCallback((data: ConfigFormData) => {
    setFormData(data);

    // TODO
  }, []);

  const delWorkspace = useCallback(() => {
    del(currentWks.id);
  }, [currentWks.id, del]);

  return {
    formData,
    settingFormData,
    delWorkspace,
  };
}