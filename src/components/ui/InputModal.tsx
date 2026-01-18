import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ActionButton } from './ActionButton';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
    title: string;
    label?: string;
    placeholder?: string;
    initialValue?: string;
    confirmText?: string;
}

export const InputModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    label,
    placeholder,
    initialValue = '',
    confirmText = 'Submit'
}: InputModalProps) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value);
        onClose();
        setValue('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    {label && <label className="text-xs font-bold uppercase text-textMuted">{label}</label>}
                    <input
                        autoFocus
                        className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <ActionButton onClick={onClose} type="button" className="bg-transparent border border-border hover:bg-white/5">Cancel</ActionButton>
                    <ActionButton primary type="submit" disabled={!value.trim()}>{confirmText}</ActionButton>
                </div>
            </form>
        </Modal>
    );
};
