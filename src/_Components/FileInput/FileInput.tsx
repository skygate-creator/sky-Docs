import Image from 'next/image';
import { getIn } from 'formik';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';

interface FileInputProps {
  label: string;
  name: string;
  formik: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileInput = ({ label, name, formik, setIsOpen }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const file = getIn(formik.values, name);
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    formik.setFieldValue(name, selectedFile);

    if (selectedFile) {
      setProgress(0);
      setIsReady(false);

      let fakeProgress = 0;

      const interval = setInterval(() => {
        fakeProgress += 10;
        setProgress(fakeProgress);

        if (fakeProgress >= 100) {
          clearInterval(interval);
          setIsReady(true);
        }
      }, 50);
    }
  };

  return (
    <div className="w-96">
      {/* label */}
      <div className="flex justify-between items-center gap-5">
        <label className="block mb-2 text-sm font-medium text-primary-300">
          {label}
        </label>
        <X
          onClick={() => setIsOpen(false)}
          className="w-5 h-5 mb-1 cursor-pointer text-primary-300"
        />
      </div>

      {/* hidden input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />

      {/* upload box */}
      <div
        onClick={handleClick}
        className={`w-full h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-white transition
          ${error && touched ? 'border-red-500' : 'border-primary/20 hover:bg-gray-50'}
        `}
      >
        {(file && typeof file === 'string') || file instanceof File ?
          <Image
            src={file instanceof File ? URL.createObjectURL(file) : file}
            alt="preview"
            width={500}
            height={300}
            className="w-full h-full object-contain"
          />
        : <>
            <div className="text-3xl text-primary mb-2">📷</div>
            <p className="text-sm text-tertiary font-medium">
              Click to upload image / video
            </p>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</span>
          </>
        }
      </div>

      {/* progress bar */}
      {file && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                isReady ? 'bg-green-500' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span>{isReady ? 'Ready to upload' : 'Preparing file...'}</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {/* error message */}
      {error && touched && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default FileInput;
