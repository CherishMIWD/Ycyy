# -*- coding: utf-8 -*-
from .config import configs

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap

db = SQLAlchemy()
bootstrap = Bootstrap()

def register_blueprints(app):
    from .apps import user,book
    app.register_blueprint(user)


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(configs.get(config))
    db.init_app(app)
    bootstrap.init_app(app)

    register_blueprints(app)  # 注册路由

    return app
