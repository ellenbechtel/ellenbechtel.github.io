# Streamgraph package
library(streamgraph)
library(ggplot2)
library(dplyr)

# examples from https://rpubs.com/hrbrmstr/59200
# streamgraph repo is https://github.com/hrbrmstr/streamgraph 

# Data 1
dat <- read.csv("http://asbcllc.com/blog/2015/february/cre_stream_graph_test/data/cre_transaction-data.csv")
dat %>%
  streamgraph("asset_class", "volume_billions", "year", interpolate="cardinal") %>%
  sg_axis_x(1, "year", "%Y") %>%
  sg_fill_brewer("PuOr")



#Data 2

data <- read.csv("http://bl.ocks.org/WillTurman/raw/4631136/data.csv", stringsAsFactors=FALSE)
data$date <- as.Date(data$date, format="%m/%d/%y")
streamgraph(data, interactive=TRUE) %>% sg_colors("Reds")






### STACKOVERFLOW TEST


## Just one
library(devtools)
source_url('https://gist.github.com/menugget/7864454/raw/f698da873766347d837865eecfa726cdf52a6c40/plot.stream.4.R')

set.seed(1)
m <- 500
n <- 50
x <- seq(m)
y <- matrix(0, nrow=m, ncol=n)
colnames(y) <- seq(n)
for(i in seq(ncol(y))){
  mu <- runif(1, min=0.25*m, max=0.75*m)
  SD <- runif(1, min=5, max=30)
  TMP <- rnorm(1000, mean=mu, sd=SD)
  HIST <- hist(TMP, breaks=c(0,x), plot=FALSE)
  fit <- smooth.spline(HIST$counts ~ HIST$mids)
  y[,i] <- fit$y
}
y <- replace(y, y<0.01, 0)

#order by when 1st value occurs
ord <- order(apply(y, 2, function(r) min(which(r>0))))
y2 <- y[, ord]
COLS <- rainbow(ncol(y2))

png("stream.png", res=400, units="in", width=12, height=4)
par(mar=c(0,0,0,0), bty="n")
plot.stream(x,y2, axes=FALSE, xlim=c(100, 400), xaxs="i", center=TRUE, spar=0.2, frac.rand=0.1, col=COLS, border=1, lwd=0.1)
dev.off()




## Two


library(devtools)
source_url('https://gist.github.com/menugget/7689145/raw/dac746aa322ca4160a5fe66c70fec16ebe26faf9/image.scale.2.r')
source_url('https://gist.github.com/menugget/7864454/raw/f698da873766347d837865eecfa726cdf52a6c40/plot.stream.4.R')
source_url('https://gist.github.com/menugget/7864471/raw/8127dfaae183233d203580bc247a73a564d5feab/plot.stacked.2.R')


set.seed(1)
m <- 500
n <- 30
x <- seq(m)
y <- matrix(0, nrow=m, ncol=n)
colnames(y) <- seq(n)
for(i in seq(ncol(y))){
  mu <- runif(1, min=0.25*m, max=0.75*m)
  SD <- runif(1, min=5, max=20)
  TMP <- rnorm(1000, mean=mu, sd=SD)
  HIST <- hist(TMP, breaks=c(0,x), plot=FALSE)
  fit <- smooth.spline(HIST$counts ~ HIST$mids)
  y[,i] <- fit$y
}
y <- replace(y, y<0.01, 0)


#Plot Ex. 1 - Color by max value
pal <- colorRampPalette(c(rgb(0.85,0.85,1), rgb(0.2,0.2,0.7)))
BREAKS <- pretty(apply(y,2,max),8)
LEVS <- levels(cut(1, breaks=BREAKS))
COLS <- pal(length(BREAKS )-1)
z <- val2col(apply(y,2,max), col=COLS)

png("stacked_stream_color_by_max.png", width=7, height=6, units="in", res=400)
layout(matrix(1:3, nrow=3, ncol=1), widths=7, heights=c(2.5,2.5,1), respect=TRUE)
par(mar=c(2,4,2,1), cex=0.75)
plot.stacked(x,y, xlim=c(100, 400), ylim=c(0, 1.2*max(apply(y,1,sum), na.rm=TRUE)), yaxs="i", col=z, border="white", lwd=0.5)
mtext("Stacked plot", line=0.25, side=3)
box()
plot.stream(x,y, xlim=c(100, 400), center=TRUE, order.method="max", spar=0.3, frac.rand=0.2, col=z, border="white", lwd=0.5)
mtext("Stream plot", line=0.25, side=3)
box()
par(mar=c(1,4,0,1))
plot(1,t="n", xlab="", ylab="", axes=FALSE)
legend("center", legend=LEVS, border="white", fill=COLS, ncol=5, bty="n", title="Max value") #pch=22, pt.bg=COL)
dev.off()


#Plot Ex. 2 - Color by first value
ord <- order(apply(y, 2, function(r) min(which(r>0))))
y2 <- y[, ord]
pal <- colorRampPalette(c("blue", "cyan", "yellow", "red"))
z <- pal(ncol(y2))

png("stacked_stream_color_by_first.png", width=7, height=5, units="in", res=400)
layout(matrix(1:2, nrow=2, ncol=1), widths=7, heights=c(2.5,2.5), respect=TRUE)
par(mar=c(2,4,2,1), cex=0.75)
plot.stacked(x,y2, xlim=c(100, 400), ylim=c(0, 1.2*max(apply(y2,1,sum), na.rm=TRUE)), yaxs="i", col=z, border=1, lwd=0.25)
mtext("Stacked plot", line=0.25, side=3)
box()
plot.stream(x,y2, xlim=c(100, 400), center=FALSE, order.method="max", spar=0.1, frac.rand=0.05, col=z, border=1, lwd=0.25)
mtext("Stream plot", line=0.25, side=3)
box()
dev.off()

