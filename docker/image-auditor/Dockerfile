FROM node:10
MAINTAINER Noël Eric

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

CMD ["node", "/opt/app/auditor.js"]
