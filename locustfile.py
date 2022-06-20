import random
from locust import HttpUser, task, between
from random import choice
from string import ascii_lowercase


class User(HttpUser):

    def __init__(self, parent):
        super(User, self).__init__(parent)
        self.token = ""

    wait_time = between(1, 2)

    def on_start(self):
        pass

    @task
    def get_product_by_id(self):
        random_id = random.randint(1, 100)

        self.client.get(
            url=f"/product/detail/{random_id}",
            name="Get Product by ID"
        )

    @task
    def get_invoice(self):
        random_id = random.randint(1, 100)

        self.client.get(
            url=f"/cashier/checkout/{random_id}?payingMethod={choice(['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'MERCADO_PAGO', 'PAYPAL'])}",
            name="Get Invoice"
        )

    @task
    def get_search(self):
        random_min = choice([random.randint(1, 100), None])
        random_max = choice([random.randint(101, 1000), None])
        random_word = choice(['phone', 'cake', 'water', 'car', 'book', None])
        random_category = choice(
            ["VEHICLES", "SUPERMARKETS", "TECHNOLOGY", "TOOLS", "SPORTS", "FASHION", "TOYS", "BOOKS", "HEALTH",
             "ELECTRONICS", "PHONES", None])

        self.client.get(
            url=f"/search/filter?minPrice={random_min}&maxPrice={random_max}&word={random_word}&category={random_category}",
            name="Get Search with Filters"
        )
