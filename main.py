from flask import Flask, render_template, request
import json
import time
import os
import pandas as pd
import json
import plotly
import plotly.express as px
import yfinance as yf
from datetime import datetime, timedelta
import plotly.graph_objects as go

app = Flask('app')

@app.route('/')
def home_page():
  return render_template("index.html")


@app.route('/projects')
def key_projects():
  return render_template("generic.html")

@app.route('/work')
def work_exp():
  return render_template("professional.html")

@app.route('/education')
def edu():
  return render_template("elements.html")

@app.route('/airbnb')
def air():
  return render_template("case_airbnb.html")

@app.route('/superstore')
def super():
  return render_template("case_1.html")

@app.route('/rataalada')
def game():
  return render_template("rataalada.html")





@app.route("/finance", methods=['GET', 'POST'])
def notdash():
    graphJSON = ''
    
    if request.method == 'POST':
        if request.form.get('action1') == 'Microsoft':
           d_10 = datetime.today() - timedelta(days=30)
           msft = yf.Ticker("MSFT")
           df = msft.history().reset_index()
           fig = go.Figure(data=[go.Candlestick(x=df['Date'],
                open=df['Open'],
                high=df['High'],
                low=df['Low'],
                close=df['Close'])])
           fig.update_layout(xaxis_rangeslider_visible=False, title_text='Microsoft Stock Analysis for the last 30 days', yaxis_title='MSFT Stock', xaxis_title = 'Dates')
           graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        elif  request.form.get('action2') == 'Apple':
           d_10 = datetime.today() - timedelta(days=30)
           apple = yf.Ticker("AAPL")
           df = apple.history(start=d_10, end=datetime.today()).reset_index()
           fig = go.Figure(data=[go.Candlestick(x=df['Date'],
                open=df['Open'],
                high=df['High'],
                low=df['Low'],
                close=df['Close'])])
           fig.update_layout(xaxis_rangeslider_visible=False, title_text='Apple Stock Analysis for the last 30 days', yaxis_title='AAPL Stock', xaxis_title = 'Dates')
           graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
           return render_template('notdash.html', graphJSON=graphJSON)
          
    elif request.method == 'GET':
        return render_template('notdash.html')
    
    return render_template('notdash.html', graphJSON=graphJSON)

@app.route("/finance", methods=['GET', 'POST'])
def bubble():
    graphJSON1 = ''
    if request.form.get('action1') == 'Microsoft':
      msft = yf.Ticker("MSFT")
      df_recommendation = (pd.DataFrame(msft.recommendations_summary['To Grade'].value_counts()/len(msft.recommendations_summary['To Grade'])*100).reset_index())
      
      fig = px.scatter(df_recommendation, x="gdpPercap", y="lifeExp",
    	         size="pop", color='index',
                     hover_name="index", log_x=True, size_max=60)
      graphJSON1 = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
      return render_template('notdash.html', graphJSON=graphJSON1)
    return render_template('notdash.html', graphJSON=graphJSON1)
app.run(host='0.0.0.0', port=8080)