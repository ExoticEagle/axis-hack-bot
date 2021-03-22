import spacy
import wikipedia
from requests import get
from bs4 import BeautifulSoup
import nltk
from nltk.translate.bleu_score import sentence_bleu
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

nlp = spacy.load('en_core_web_sm')

science_vocab = set()
with open('vocab.txt') as f:
  text = f.readline()
  while text:
    science_vocab.add(text.lower().strip())
    text = f.readline()

def get_tokens(text):
  text_tokens = word_tokenize(text)
  tokens_without_sw = [word for word in text_tokens if not word in stopwords.words()]
  return tokens_without_sw

def remove_stop_words(text):
  tokens_without_sw = get_tokens(text)
  return " ".join(tokens_without_sw)

def get_science_word_count(tweet):
  tweet = re.sub(r'[,\.]', ' ', tweet)
  doc = nlp(tweet)
  words = []
  tokens = [token.lemma_.lower() for token in doc]
  c = 0
  for word in tokens:
    if word in science_vocab:
      print(word)
      words.append(word)
      c += 1
  return c, (" ".join(words))

def search(term, num_results=10, lang="en"):
    usr_agent = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/61.0.3163.100 Safari/537.36'}

    def fetch_results(search_term, number_results, language_code):
        escaped_search_term = search_term.replace(' ', '+')

        google_url = 'https://www.google.com/search?q={}&num={}&hl={}'.format(escaped_search_term, number_results+1,
                                                                              language_code)
        response = get(google_url, headers=usr_agent)
        response.raise_for_status()

        return response.text

    def parse_results(raw_html):
        soup = BeautifulSoup(raw_html, 'html.parser')
        result_block = soup.find_all('div', attrs={'class': 'g'})
        for result in result_block:
            link = result('div', {"role": "heading"})
            title = result.find('h3')
            yield link

    html = fetch_results(term, num_results, lang)
    return list(parse_results(html))

def get_contents(soup):
  if isinstance(soup, str):
    return soup
  try:
    iterator = iter(soup)
  except TypeError:
    child_contents = []
    for x in soup.contents:
      child_contents.append(get_contents(x))
    return "".join(child_contents)
  else:
    return " ".join([get_contents(c) for c in soup])
  
def contents(x):
  c = get_contents(x)
  if c.find("People also search for"):
    x = c.find("People also search for")
    c = c[:x]
  c = c.strip().replace("\xa0", "")
  c = re.sub(r'\s+', ' ', c)
  return c

def get_summary_text(tweet):
  summaries = []
  _, science = get_science_word_count(tweet)
  doc = nlp(tweet)
  for ent in get_tokens(science):
    summary = ""
    try:
      summary = wikipedia.summary(ent)
    except Exception:
      summary = ""
    summaries.append(summary)
  try:
    tweet_page = wikipedia.page(science)
    summaries.append(tweet_page.summary)
  except:
    pass
  try:
    another_page = wikipedia.page(remove_stop_words(science))
    if tweet_page and tweet_page.title != another_page.title:
      summaries.append(another_page.summary)
      okay = 2
  except:
    pass
  google_summary = contents(search(tweet))
  summaries.append(google_summary)
  google_summary = contents(search(remove_stop_words(tweet)))
  summaries.append(google_summary)
  for s in summary_get_sentences(tweet):
    print(s, 'h')
    google_summary = contents(search(s))
    summaries.append(google_summary)

  return "\n".join(summaries)

def summary_get_sentences(sum):
  doc = nlp(sum)
  return [x.text.strip() for x in doc.sents]

def sentence_get_value(sentence, tweet):
  tweet_doc = nlp(tweet)
  tweet_sentences = [sent.text for sent in tweet_doc.sents]
  tweet_sentence_docs = [nlp(s) for s in tweet_sentences]
  reference = [[token.text for token in doc] for doc in tweet_sentence_docs]
  sentence_doc = nlp(sentence)
  candidate = [token.text for token in sentence_doc]

  score = sentence_bleu(reference, candidate, weights=(0.25, 0.25, 0.25, 0))
  return score

def tweet_get_reply(tweet):
  summary = get_summary_text(tweet)
  sentences = summary_get_sentences(summary)
  print(sentences)
  sentences = list(set(sentences))
  sentences.sort(key=lambda x: sentence_get_value(x, tweet), reverse=True)
  final_sentences = sentences[:3]
  reply = ". ".join(final_sentences)
  return re.sub(r'\s+', ' ', reply).strip()

