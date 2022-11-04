import { createGlobalStyle } from "styled-components"

export const lightTheme ={
    body : '#fff',
    fontColor : '#000'
}

export const darkTheme = {
    body : '#121212',
    fontColor : '#fff',
    cardBg : '#383838',
    inputColor : '#121212',
    ballColor : 'black',
    labelColor : 'white'
}

export const GlobalStyle = createGlobalStyle`
    body{
        background-color: ${props => props.theme.body};
        color: ${props => props.theme.fontColor}
    }
    .modal-content,.card{
        background-color: ${props=>props.theme.cardBg}
    }
    input[type='text'],input[type='number'],input[type='date'],.form-select,#desc,#desc1    {
        background-color: ${props => props.theme.inputColor};
        color: grey
    }
    .label123{
        background-color: ${props=> props.theme.labelColor}
    }
    .ball{
        background-color: ${props=> props.theme.ballColor}
    }
`
