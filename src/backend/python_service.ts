import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let pythonProcess: ChildProcess | null = null;
const PYTHON_API_PORT = 8000;
const PYTHON_API_URL = `http://127.0.0.1:${PYTHON_API_PORT}`;

export function startPythonBackend(): void {
  if (pythonProcess) {
    return;
  }

  const backendScript = path.join(process.cwd(), 'src', 'backend', 'main.py');
  console.log(`[Python Backend] Launching FastAPI server on port ${PYTHON_API_PORT}...`);

  pythonProcess = spawn('python3', [
    '-m', 'uvicorn',
    'main:app',
    '--app-dir', path.join(process.cwd(), 'src', 'backend'),
    '--host', '127.0.0.1',
    '--port', String(PYTHON_API_PORT),
    '--log-level', 'info'
  ], {
    stdio: 'pipe',
    env: { ...process.env, PYTHONPATH: path.join(process.cwd(), 'src', 'backend') }
  });

  pythonProcess.stdout?.on('data', (data) => {
    console.log(`[Python FastAPI] ${data.toString().trim()}`);
  });

  pythonProcess.stderr?.on('data', (data) => {
    console.error(`[Python FastAPI Log] ${data.toString().trim()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[Python Backend] Exited with code ${code}`);
    pythonProcess = null;
  });

  process.on('exit', () => {
    if (pythonProcess) {
      pythonProcess.kill();
    }
  });
}

export { PYTHON_API_URL };
