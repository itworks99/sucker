FROM python:alpine

LABEL Name=sucker Version=0.1.0
EXPOSE 8080

WORKDIR /app
ADD . /app
ADD src src
ADD public public
ADD build build

RUN python3 -m pip install -r requirements.txt
CMD ["python3", "src/sucker.py"]