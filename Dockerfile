FROM python:alpine

LABEL Name=sucker Version=0.4.0
EXPOSE 3000

WORKDIR /app
ADD . /app
ADD src src
ADD srv srv
ADD public public
ADD build build

RUN apk add nodejs npm
RUN npm install -g corepack
RUN corepack enable
RUN corepack prepare yarn@4.12.0 --activate
RUN yarn install
RUN yarn build
RUN python3 -m pip install -e srv/
CMD ["python3", "srv/sucker.py"]