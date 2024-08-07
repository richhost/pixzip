import { contextBridge, ipcRenderer } from 'electron';
import { type ElectronAPI, electronAPI } from '@electron-toolkit/preload';

const workspace = {
	// getWorkspaces: () => ipcRenderer.invoke('getWorkspaces') as Promise<Pixzip.Workspace[]>,
	// addWorkspace: (w: Pixzip.Workspace) =>
	// 	ipcRenderer.invoke('addWorkspace', w) as Promise<Pixzip.Workspace[]>,
	// updateWorkspace: (w: Pixzip.Workspace) =>
	// 	ipcRenderer.invoke('updateWorkspace', w) as Promise<Pixzip.Workspace[]>,
	// deleteWorkspace: (id: string) =>
	// 	ipcRenderer.invoke('deleteWorkspace', id) as Promise<Pixzip.Workspace[]>
};

const folderPicker = () => ipcRenderer.invoke('folderPicker') as Promise<string[]>;

type ProcessingParams = Extract<Pixzip.SendData, { status: 'processing' }>;
type SucceedParams = Extract<Pixzip.SendData, { status: 'succeed' }>;
type FailedParams = Extract<Pixzip.SendData, { status: 'failed' }>;

const task = {
	addTask: (task: Pixzip.Task | Pixzip.Task[]) => ipcRenderer.send('addTask', task),
	clearTask: (workspaceId: string) => ipcRenderer.send('clearTask', workspaceId),
	removeTask: (workspaceId: string, filepath: string) =>
		ipcRenderer.send('removeTask', { workspaceId, filepath }),
	precessing: (cb: (params: ProcessingParams) => void) =>
		ipcRenderer.on('processing', (_, params) => {
			cb(params);
		}),
	succeed: (cb: (params: SucceedParams) => void) => {
		ipcRenderer.on('succeed', (_, params) => {
			cb(params);
		});
	},
	failed: (cb: (params: FailedParams) => void) => {
		ipcRenderer.on('failed', (_, params) => {
			cb(params);
		});
	},
	removePrecessingListener: () => ipcRenderer.removeAllListeners('processing'),
	removeSucceedListener: () => ipcRenderer.removeAllListeners('succeed'),
	removeFailedListener: () => ipcRenderer.removeAllListeners('failed')
};

const action = {
	copy: (filepath: string) => ipcRenderer.send('copy', filepath),
	trash: (outputPath: string) => ipcRenderer.send('trash', outputPath),
	reveal: (outputPath: string) => ipcRenderer.send('reveal', outputPath),
	folderPicker,
	openUrl: (url: string) => ipcRenderer.send('openUrl', url)
};

const space = {
	getSpaces: () => ipcRenderer.invoke('getSpaces'),
	addSpace: () => ipcRenderer.invoke('addSpace')
};

const pixzip = {
	os: process.platform,
	workspace,
	task,
	action,
	space,
	invoke: ipcRenderer.invoke,
	on: ipcRenderer.on,
	off: ipcRenderer.off,
	send: ipcRenderer.send
};

// contextBridge.exposeInMainWorld('pixzip', pixzip);

declare global {
	interface Window {
		pixzip: ElectronAPI;
	}
}

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('pixzip', electronAPI);
	} catch (error) {
		console.error(error);
	}
} else {
	window.pixzip = electronAPI;
}
