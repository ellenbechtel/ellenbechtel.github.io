library(shiny)
library(dataRetrieval)

ui <- fluidPage(
  sliderInput(inputId ="num",
              label = "Choose a number",
              value = 500, min = 1, max = 1000),
  plotOutput("hist")
                )

server <- function(input, output) {
  output$hist <- renderPlot({ 
      title <- "100 random normal values"
      hist(rnorm(input$num)) 
  })
}

shinyApp(ui = ui, server = server)