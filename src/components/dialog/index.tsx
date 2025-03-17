import React, { useRef, useEffect } from 'react';

interface MyDialogProps {
    isOpen: boolean;
    onClose: (returnValue?: string) => void;
    title?: string;
    children: React.ReactNode;
}

const MyDialog: React.FC<MyDialogProps> = ({ isOpen, onClose, title, children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null); // Ref to the <dialog> element

    useEffect(() => {
        const dialogElement = dialogRef.current;

        if (!dialogElement) return; // Safety check if ref is not yet attached

        if (isOpen) {
            dialogElement.showModal(); // Show as modal when isOpen prop is true
        } else {
            dialogElement.close();     // Close when isOpen prop is false
        }

        const handleClose = () => {
            onClose(dialogElement.returnValue); // Call onClose prop with returnValue
        };

        dialogElement.addEventListener('close', handleClose); // Listen for 'close' event

        return () => {
            dialogElement.removeEventListener('close', handleClose); // Cleanup on unmount/prop change
        };
    }, [isOpen, onClose]); // Effect depends on isOpen and onClose props

    return (
        <dialog ref={dialogRef}>
            <form method="dialog"> {/* Important for closing on form submission */}
                {title && <h2>{title}</h2>}
                {children}
                <div>
                    <button type="submit" value="confirm">OK</button>
                </div>
            </form>
        </dialog>
    );
};

export default MyDialog;
