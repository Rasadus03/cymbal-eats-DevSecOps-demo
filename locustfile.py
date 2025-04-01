import time
from locust import HttpUser, TaskSet, task, between
import json



import time


class StressTes(HttpUser):
    wait_time = between(1, 2)

    @task
    def getRestaurants(self):
        self.client.get("/restaurants-api/restaurants")


    def on_start(self):
        self.client.get("/restaurants-api/restaurants")