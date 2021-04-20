FROM python:alpine

LABEL Name=sucker Version=0.3
EXPOSE 3000

WORKDIR /app
ADD . /app
ADD src src
ADD srv srv
ADD public public
ADD build build

RUN apk add yarn
RUN yarn install
RUN yarn build
RUN python3 -m pip install -r srv/requirements.txt
CMD ["python3", "srv/sucker.py"]