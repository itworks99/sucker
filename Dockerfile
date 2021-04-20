FROM python:alpine

LABEL Name=sucker Version=0.2
EXPOSE 3000

WORKDIR /app
ADD . /app
ADD srv srv
ADD public public
ADD build build

RUN python3 -m pip install -r srv/requirements.txt
CMD ["python3", "srv/sucker.py"]