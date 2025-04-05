import { createContext } from 'react';
import main from "../config/gemini"

export const Context = createContext()

const ContextProvider = (props) => {

    const onSent = async (prompt) => {
        await main(prompt)
    }

    onSent("What is a hackathon?")

    const ContextValue = {

    }

    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
