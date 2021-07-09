import createTheme from "@material-ui/core/styles/createTheme";

export default class GraphicsHandler {
    
    static instance = new GraphicsHandler();
    mobileWidth = 700;
    density = window.devicePixelRatio;
    width = 0;
    height = 0;
    cmWidth = 0;
    cmHeight = 0;
    theme = createTheme({
        palette: {
            primary: {
                main: '#673ab7',
            },
            secondary: {
                main: '#2979ff',
            },
        },
    });
    production = false;
    
    constructor() {
        GraphicsHandler.instance = this;
        window.addEventListener('resize', this.updateCmWindowDimensions);
        this.updateCmWindowDimensions();
    }
    
    loginBackground() {
        return '/balloon.jpg';
    }
    
    dashboardBackground() {
        return '/balloon.jpg';
    }
    
    dpToPx(dp) {
        return dp * this.density;
    }
    
    pxToDp(px) {
        return px / this.density;
    }
    
    isMobileScreen() {
        return this.width < this.mobileWidth;
    }
    
    updateCmWindowDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
}
