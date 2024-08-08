import path from 'path';

export default function src(...dir: string[]) {
  return path.join(__dirname, '..', ...dir);
}
