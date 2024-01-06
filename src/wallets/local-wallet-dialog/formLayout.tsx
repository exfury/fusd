
export interface FormComponent<T> {
    success: boolean
    onSubmitValue: T | undefined
    reset: () => void // Resets the success of the form (to allow for going back)
    formElement: JSX.Element
}

export interface FormComponentProps {
    autoSubmit?: boolean
}